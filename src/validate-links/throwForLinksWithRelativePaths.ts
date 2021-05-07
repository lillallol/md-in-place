import { JSDOM } from "jsdom";
import { errorMessages } from "../errorMessages";
import { mdToAst } from "../generate-toc/mdToAst";
import { mdToHtml } from "../generate-toc/mdToHtml";

export function throwForLinksWithRelativePaths(md: string): void {
    //that is hacky way that I do not like
    mdToAst(md)
        .children.map(
            ({
                type,
                position: {
                    start: { offset: startOffset },
                    end: { offset: endOffset },
                },
            }) => {
                if (type === "html") {
                    return md.slice(startOffset, endOffset);
                }
                return mdToHtml(md.slice(startOffset, endOffset));
            }
        )
        .forEach((htmlFragment) => {
            JSDOM.fragment(htmlFragment)
                .querySelectorAll("a")
                .forEach((a) => {
                    if (a.href.startsWith(".")) {
                        throw Error(errorMessages.encounteredLinkWithRelativePathInGeneratedMd(a.href));
                    }
                });
        });
}
