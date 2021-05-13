export const headingCount: { [headingCount: string]: number } = {};

/**
 * Steps followed from here:
 * https://gist.github.com/asabaylus/3071099#gistcomment-1593627
 */
export function markdownHeadingToId(markdownHeadingSrc: string): string {
    let toReturn = markdownHeadingSrc
        .trim()
        .toLowerCase()
        .replace(/[^\w-]/gu, "")
        .replace(/ /g, "-");
    if (headingCount[toReturn] === undefined) headingCount[toReturn] = 0;
    headingCount[toReturn] = headingCount[toReturn] + 1;
    if (headingCount[toReturn] > 1) {
        toReturn = toReturn + `-${headingCount[toReturn] - 1}`;
        if (headingCount[toReturn] === undefined) headingCount[toReturn] = 0;
        headingCount[toReturn] = headingCount[toReturn] + 1;
    }
    return toReturn;
}
