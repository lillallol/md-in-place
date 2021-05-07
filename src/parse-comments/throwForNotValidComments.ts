import * as path from "path";
import * as fs from "fs";

import { errorMessages, internalErrorMessages } from "../errorMessages";
import { parsedComment } from "../types";
import { ParsedStartComment } from "./ParsedStartComment";
import { ParsedEndTocComment } from "./ParsedEndTocComment";
import { ParsedStartTocComment } from "./ParsedStartTocComment";
import { ParsedEndComment } from "./ParsedEndComment";

//@TODO it would be a good idea to print the toc comments in the error messages
export function throwForNotValidComments(parsedComments: parsedComment[], pathToFolderContainingMd: string): void {
    let tocRegionHasBeenEncounteredInLines: { start: number; end: number } | undefined = undefined;
    for (let i = 0; i  < parsedComments.length; i = i + 2) {
        const startComment = parsedComments[i];
        const endComment = parsedComments[i + 1];

        if (
            endComment === undefined &&
            (startComment instanceof ParsedStartComment || startComment instanceof ParsedStartTocComment)
        ) {
            throw Error(
                errorMessages.endingCommentMissing({
                    startTocCommentLine: startComment.line,
                })
            );
        }

        if (endComment === undefined && startComment instanceof ParsedEndComment) {
            throw Error(
                errorMessages.startingCommentMissing({
                    endTocCommentLine: startComment.line,
                })
            );
        }

        if (
            tocRegionHasBeenEncounteredInLines === undefined &&
            startComment instanceof ParsedStartTocComment &&
            !(endComment instanceof ParsedEndTocComment)
        ) {
            throw Error(
                errorMessages.hasToBeEndTocComment({
                    endTocCommentLine: endComment.line,
                })
            );
        }

        if (tocRegionHasBeenEncounteredInLines === undefined && startComment instanceof ParsedEndTocComment) {
            throw Error(
                errorMessages.endTocCommentWithoutStart({
                    endTocCommentLine: startComment.line,
                })
            );
        }

        if (
            tocRegionHasBeenEncounteredInLines === undefined &&
            startComment instanceof ParsedStartTocComment &&
            endComment instanceof ParsedEndTocComment
        ) {
            tocRegionHasBeenEncounteredInLines = {
                end: endComment.line,
                start: startComment.line,
            };
            continue;
        }

        if (
            tocRegionHasBeenEncounteredInLines !== undefined &&
            (startComment instanceof ParsedStartTocComment ||
                startComment instanceof ParsedEndTocComment ||
                endComment instanceof ParsedStartTocComment ||
                endComment instanceof ParsedEndTocComment)
        ) {
            const { start, end } = tocRegionHasBeenEncounteredInLines;
            const tocCommentLine = ((): number => {
                if (startComment instanceof ParsedEndTocComment || startComment instanceof ParsedStartTocComment) {
                    return startComment.line;
                }
                if (endComment instanceof ParsedEndTocComment || endComment instanceof ParsedStartTocComment) {
                    return endComment.line;
                }
                throw Error(internalErrorMessages.internalLibraryError);
            })();

            throw Error(
                errorMessages.tocAlreadyDefined({
                    badTocCommentLine: tocCommentLine,
                    goodTocCommentEndLine: end,
                    goodTocCommentStartLine: start,
                })
            );
        }

        if (!(startComment instanceof ParsedStartComment)) {
            throw Error(
                errorMessages.hasToBeStartComment({
                    startCommentLine: startComment.line,
                })
            );
        }
        if (
            endComment instanceof ParsedStartComment ||
            endComment instanceof ParsedStartTocComment ||
            endComment instanceof ParsedEndTocComment
        ) {
            throw Error(
                errorMessages.hasToBeEndComment({
                    endCommentLine: endComment.line,
                })
            );
        }

        const { keyword: keywordStart, absolutePath: relativePath } = startComment;
        const { keyword: keywordEnd } = endComment;

        if (keywordStart !== keywordEnd) {
            throw Error(
                errorMessages.commentRegionDoesNotHaveSameKeyword({
                    endCommentKeyword: endComment.keyword,
                    endCommentLine: endComment.line,
                    startCommentKeyword: startComment.keyword,
                    startCommentLine: startComment.line,
                })
            );
        }

        const absolutePathToFileToInject = path.resolve(pathToFolderContainingMd, relativePath);

        try {
            fs.accessSync(absolutePathToFileToInject);
        } catch {
            //TODO add keyword in the error message
            throw Error(errorMessages.relativePathOfFileToInjectCanNotBeAccessed(relativePath));
        }
    }
}
