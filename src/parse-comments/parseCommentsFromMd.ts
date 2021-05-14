import * as path from "path";

import { JSDOM } from "jsdom";
import { mdToAst } from "../generate-toc/mdToAst";
import { astNode, parsedComment } from "../types";
import { ParsedEndComment } from "./ParsedEndComment";
import { ParsedStartComment } from "./ParsedStartComment";
import { ParsedStartTocComment } from "./ParsedStartTocComment";
import { throwForNotValidComments } from "./throwForNotValidComments";
import { ParsedEndTocComment } from "./ParsedEndTocComment";
import { internalErrorMessages } from "../errorMessages";
import { constants } from "../constants";
import { getIndentForComment } from "./getIndentForComment";

export function parseCommentsFromMd(md: string, absolutePathToFolderOfMd: string): parsedComment[] {
    const toReturn: parsedComment[] = [];

    (function recurse(astNode: astNode) {
        const { type } = astNode;
        if (type === "html") {
            temp({ astNode });
            return;
        }
        astNode.children?.forEach((astNode) => {
            recurse(astNode);
        });
    })(mdToAst(md));

    throwForNotValidComments(toReturn, absolutePathToFolderOfMd);

    return toReturn;

    //add toReturn as a parameter here
    //add md as a parameter here
    function temp(_: { astNode: astNode }) {
        const {
            injectFileCommentEndValueRegExp,
            injectFileCommentStartValueRegExp,
            injectTocCommentEndValueRegExp,
            injectTocCommentStartValueRegExp,
        } = constants;
        const { astNode } = _;
        const {
            position: {
                start: { offset: startOffset, line },
                end: { offset: endOffset },
            },
        } = astNode;
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
                    const { indent } = getIndentForComment({ md, startOffset });
                    const { groups } = tocStart;
                    if (groups === undefined) throw Error(internalErrorMessages.internalLibraryError);
                    const collapse: boolean = (() => {
                        if (groups.collapse === undefined) return false;
                        if (typeof groups.collapse === "string") return true;
                        throw Error(internalErrorMessages.internalLibraryError);
                    })();

                    toReturn.push(
                        new ParsedStartTocComment({
                            endOffset,
                            startOffset,
                            keyword: "toc",
                            line,
                            indent,
                            collapse,
                        })
                    );
                    return;
                }
                if (tocEnd !== null) {
                    const { indent, trimmedStartStartOffset } = getIndentForComment({ md, startOffset });

                    toReturn.push(
                        new ParsedEndTocComment({
                            endOffset,
                            startOffset: trimmedStartStartOffset,
                            keyword: "toc",
                            line,
                            indent,
                        })
                    );
                    return;
                }

                const startMatch = string.match(injectFileCommentStartValueRegExp);
                const endMatch = string.match(injectFileCommentEndValueRegExp);

                if (startMatch !== null) {
                    const { groups } = startMatch;
                    if (groups === undefined) throw Error(internalErrorMessages.internalLibraryError);

                    const { keyword, exclamationMark, path: relativePath } = groups;
                    const { indent } = getIndentForComment({ md, startOffset });
                    toReturn.push(
                        new ParsedStartComment({
                            endOffset,
                            startOffset,
                            keyword,
                            absolutePath: path.resolve(absolutePathToFolderOfMd, relativePath),
                            exclamationMarks: exclamationMark,
                            line,
                            indent,
                        })
                    );
                    return;
                }

                if (endMatch !== null) {
                    const { groups } = endMatch;
                    if (groups === undefined) throw Error(internalErrorMessages.internalLibraryError);

                    const { keyword } = groups;
                    const { trimmedStartStartOffset, indent } = getIndentForComment({ md, startOffset });
                    toReturn.push(
                        new ParsedEndComment({
                            endOffset,
                            startOffset: trimmedStartStartOffset,
                            keyword,
                            line,
                            indent,
                        })
                    );
                    return;
                }
            });
    }
}
