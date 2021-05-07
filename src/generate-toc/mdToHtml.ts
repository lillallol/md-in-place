import * as unified from "unified";
import * as remarkParse from "remark-parse"; // parses md to syntax tree
import * as remarkRehype from "remark-rehype";
import * as rehypeStringify from "rehype-stringify";
import * as remarkGfm from "remark-gfm";
import { internalErrorMessages, errorMessages } from "../errorMessages";

/**
 * @description
 * This does not work with gfm markdown, and I have made sure not to use it for
 * such cases.
 */
export function mdToHtml(md: string): string {
    const _: { toReturn?: string } = {};

    unified()
        // remark()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(md, function (err, file) {
            if (err) {
                const { message, stack } = err;

                throw Error(
                    errorMessages.failedToParseMdToHtml({
                        errorMessage: message,
                        errorStack: stack,
                        md,
                    })
                );
            }
            _.toReturn = String(file);
        });

    const { toReturn } = _;
    if (typeof toReturn !== "string") throw Error(internalErrorMessages.internalLibraryError);
    return toReturn;
}
