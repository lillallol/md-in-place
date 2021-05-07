import { parsedHeading } from "../types";
import { htmlFragmentToParsedHeadings } from "./htmlFragmentToParsedHeadings";
import { mdToAst } from "./mdToAst";
import { mdToHtml } from "./mdToHtml";

/**
 * @description
 * Given a markdown file it returns all the headings without changing their order.
 * If a markdown heading is encountered it is converted to html.
 *
 * Markdown headings have to be converted to html because their id has
 * to be extracted and complicated cases like this:
 * ```md
 * ## **[hello world](./a/link)**
 * ```
 * make it difficult to extract the id without converting it to html.
 */
export function parseHeadingsFromMd(md: string): parsedHeading[] {
    const toReturn: parsedHeading[] = [];

    mdToAst(md).children.forEach(
        ({
            type,
            position: {
                start: { offset: startOffset },
                end: { offset: endOffset },
            },
        }) => {
            if (type === "html") {
                toReturn.push(...htmlFragmentToParsedHeadings(md.slice(startOffset, endOffset)));
            }
            if (type === "heading") {
                toReturn.push(...htmlFragmentToParsedHeadings(mdToHtml(md.slice(startOffset, endOffset))));
            }
        }
    );

    return toReturn;
}
