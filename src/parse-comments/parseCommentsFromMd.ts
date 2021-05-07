import * as path from "path";

import { JSDOM } from "jsdom";
import { mdToAst } from "../generate-toc/mdToAst";
import { parsedComment } from "../types";
import { ParsedEndComment } from "./ParsedEndComment";
import { ParsedStartComment } from "./ParsedStartComment";
import { ParsedStartTocComment } from "./ParsedStartTocComment";
import { throwForNotValidComments } from "./throwForNotValidComments";
import { ParsedEndTocComment } from "./ParsedEndTocComment";
import { internalErrorMessages } from "../errorMessages";
import { constants } from "../constants";

export function parseCommentsFromMd(md: string, absolutePathToFolderOfMd: string): parsedComment[] {
    const toReturn: parsedComment[] = [];
    const {
        injectFileCommentEndValueRegExp,
        injectFileCommentStartValueRegExp,
        injectTocCommentEndValueRegExp,
        injectTocCommentStartValueRegExp,
    } = constants;
    mdToAst(md).children.forEach(
        ({
            type,
            position: {
                start: { offset: startOffset, line },
                end: { offset: endOffset },
            },
        }) => {
            if (type === "html") {
                [...JSDOM.fragment(md.slice(startOffset, endOffset)).childNodes]
                    .filter(({ nodeType }) => nodeType === 8)
                    .forEach((node) => {
                        const string = node.nodeValue;

                        //@TODO is this a legit case?
                        if (string === null) return;

                        const tocStart = string.match(injectTocCommentStartValueRegExp);
                        const tocEnd = string.match(injectTocCommentEndValueRegExp);

                        /**
                         * These two if clauses for toc have to be executed before the inject file if clauses
                         */
                        if (tocStart !== null) {
                            toReturn.push(
                                new ParsedStartTocComment({
                                    endOffset,
                                    startOffset,
                                    keyword: "toc",
                                    line,
                                })
                            );
                            return;
                        }
                        if (tocEnd !== null) {
                            toReturn.push(
                                new ParsedEndTocComment({
                                    endOffset,
                                    startOffset,
                                    keyword: "toc",
                                    line,
                                })
                            );
                            return;
                        }

                        const startMatch = string.match(injectFileCommentStartValueRegExp);
                        const endMatch = string.match(injectFileCommentEndValueRegExp);

                        if (startMatch !== null) {
                            const { groups } = startMatch;
                            if (groups === undefined) throw Error(internalErrorMessages.internalLibraryError);

                            const { keyword, questionMark, path: relativePath } = groups;
                            toReturn.push(
                                new ParsedStartComment({
                                    endOffset,
                                    startOffset,
                                    keyword,
                                    absolutePath: path.resolve(absolutePathToFolderOfMd, relativePath),
                                    shouldCodeBlock: questionMark === undefined ? false : true,
                                    line,
                                })
                            );
                            return;
                        }

                        if (endMatch !== null) {
                            const { groups } = endMatch;
                            if (groups === undefined) throw Error(internalErrorMessages.internalLibraryError);

                            const { keyword } = groups;
                            toReturn.push(
                                new ParsedEndComment({
                                    endOffset,
                                    startOffset,
                                    keyword,
                                    line,
                                })
                            );
                            return;
                        }
                    });
            }
        }
    );

    throwForNotValidComments(toReturn, absolutePathToFolderOfMd);
    return toReturn;
}
