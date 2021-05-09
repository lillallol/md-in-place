import { parsedComment } from "../types";

export function templateStringsArray(md: string, parsedComments: parsedComment[]): string[] {
    const templateStringsArray: string[] = [];

    {
        let i = 0;
        /**
         * ```
         * <!--start -->i
         *
         * f<!--end -->
         * ```
         */
        for (let ii = 0; ii < parsedComments.length; ii++) {
            if (ii % 2 === 0) {
                const { endOffset } = parsedComments[ii];
                templateStringsArray.push(md.slice(i, endOffset));
            }
            if (ii % 2 === 1) {
                const { startOffset, indent } = parsedComments[ii];
                i = startOffset - indent.length;
            }
        }

        templateStringsArray.push(md.slice(i, md.length));
    }

    return templateStringsArray;
}
