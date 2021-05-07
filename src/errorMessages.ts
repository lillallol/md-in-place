import { constants } from "./constants";
import { tagUnindent } from "./es-utils/tagUnindent";

const {
    tocCommentStartRegExpSrc: tocHtmlCommentStartRegExpSource,
    tocCommentEndRegExpSrc: tocHtmlCommentEndRegExpSource,
} = constants;

export const errorMessages = {
    inputFileCanNotBeAccessed: (input: string): string => tagUnindent`
        Input file at absolute path:

            ${input}

        can not be accessed.
    `,
    badConsecutiveHeadings: (title1: string, title2: string): string => tagUnindent`
        The heading with title:
    
            ${title1}
    
        has next heading with title:
    
            ${title2}
    
        that has depth difference greater than 1.
    
        Here is an example of markdown file that triggers this error:
    
            ## title 1 of depth 2
    
            #### title 2 of depth 4
    
    `,
    idIsAlreadyUsed: (id: string): string => tagUnindent`
        There two or more headings which corresponds to the following id:

            ${id}

        while there should be only one.
    `,
    badPlaceForH1: "Heading H1 has to be before every other heading.",
    moreThanOneStartCommentForToc: tagUnindent`
        There are more than one starting comments for toc:
    
            ${tocHtmlCommentStartRegExpSource}
        
        while there has to be only one.
    `,
    endCommentForTocDoesNotExist: tagUnindent`
        Ending comment for toc:
    
            ${tocHtmlCommentEndRegExpSource}
    
        does not exist.
    `,
    moreThanOneEndCommentForToc: tagUnindent`
        There are more than one ending comments for toc:
    
            ${tocHtmlCommentEndRegExpSource}
    
        while there has to be only one.
    `,
    relativePathOfFileToInjectCanNotBeAccessed: (relativePath: string): string => tagUnindent`
        Extracted path:

            ${relativePath}

        from starting comment to inject file, can not be accessed.
    `,
    commentRegionDoesNotHaveSameKeyword: (_: {
        startCommentLine: number;
        startCommentKeyword: string;
        endCommentLine: number;
        endCommentKeyword: string;
    }): string => tagUnindent`
        Encountered consecutive starting and ending comment for file import,
        that have different keywords while they should have the same:

            START

                line    : ${_.startCommentLine}
                keyword : ${_.startCommentKeyword}

            END

                line    : ${_.endCommentLine}
                keyword : ${_.endCommentKeyword}

    `,
    hasToBeEndComment: (_: { endCommentLine: number }): string => tagUnindent`
        Encountered comment in line:
    
            ${_.endCommentLine}
        
        that is supposed to be end comment for file import but it is not.
    `,
    hasToBeStartComment: (_: { startCommentLine: number }): string => tagUnindent`
        Encountered comment in line:

            ${_.startCommentLine}

        that is supposed to be start comment for file import but it is not.
    `,
    tocAlreadyDefined: (_: {
        badTocCommentLine: number;
        goodTocCommentStartLine: number;
        goodTocCommentEndLine: number;
    }): string => tagUnindent`
        Encountered a toc comment at line:

            ${_.badTocCommentLine}

        while the toc comment region has already been encountered at lines:

            start : ${_.goodTocCommentStartLine}
            end   : ${_.goodTocCommentEndLine}

    `,
    hasToBeEndTocComment: (_: { endTocCommentLine: number }): string => tagUnindent`
        Encountered comment in line:

            ${_.endTocCommentLine}

        that is not toc comment end, as it should be, since it is immediately
        preceded by start toc comment.
    `,
    endTocCommentWithoutStart: (_: { endTocCommentLine: number }): string => tagUnindent`
        Encountered end toc comment in line:

            ${_.endTocCommentLine}

        that is not preceded by a start toc comment.
    `,
    /**
     * @description
     * This error message targets the last stray start comment of an array of parsed comments that total in odd length
     */
    endingCommentMissing: (_: { startTocCommentLine: number }): string => tagUnindent`
        Starting comment in line:

            ${_.startTocCommentLine}

        does not have an ending comment.
    `,
    /**
     * @description
     * This error message targets the last stray end comment of an array of parsed comments that total in odd length
     */
    startingCommentMissing: (_: { endTocCommentLine: number }): string => tagUnindent`
        Ending comment in line:

            ${_.endTocCommentLine}

        does not have a starting comment.
    `,
    encounteredLinkWithRelativePathInGeneratedMd: (link: string): string => tagUnindent`
        Encountered link with relative path:
    
            ${link}
    
        in the generated markdown.
    `,
    encounteredTextLessHeading: (html: string): string => tagUnindent`
        Encountered html heading without text:

            ${html}
        
    `,
    failedToParseMdToHtml: (_: { md: string; errorMessage: string; errorStack: string | undefined }): string => {
        const { errorMessage, errorStack, md } = _;

        const stackMessage = (() => {
            if (errorStack === undefined) return "";
            return tagUnindent`
                stack :

                    ${[errorStack]}
            `;
        })();

        return tagUnindent`
            Got an error while trying to convert markdown to html.

                ${errorMessage}

            ${[stackMessage]}

            markdown:

                ${[md]}
        `;
    },
    badHeadingIdPattern: (_: {
        id: string;
        headingOuterHtml: string;
        headingIdRegExpSrc: string;
    }): string => tagUnindent`
        The extracted id:

            ${_.id}

        of the following heading:

            ${_.headingOuterHtml}

        does not satisfy the regular expression:

            ${_.headingIdRegExpSrc}

    `,
};

export const internalErrorMessages = {
    internalLibraryError: "internal library error",
};
