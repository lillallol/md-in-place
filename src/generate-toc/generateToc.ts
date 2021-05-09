import { constants } from "../constants";
import { throwIfNotValidToc } from "./throwIfNotValidToc";
import { parseHeadingsFromMd } from "./parseHeadingsFromMd";

export function generateToc(md: string, indent: string): string {
    const parsedHeadings = parseHeadingsFromMd(md);
    const { tocSpacing } = constants;
    const minTocDepth = Math.min(...parsedHeadings.map(({ number }) => number));
    throwIfNotValidToc(parsedHeadings);
    return parsedHeadings
        .map(({ id, title, number }) => {
            return `${indent}${tocSpacing.repeat(number - minTocDepth)}- [${title}](#${id})`;
        })
        .join("\n");
}
