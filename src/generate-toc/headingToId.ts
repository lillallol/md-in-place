export const headingCount: { [headingCount: string]: number } = {};

/**
 * @description
 * Steps followed from here:
 * https://gist.github.com/asabaylus/3071099#gistcomment-1593627
 */
export function headingToId(_: {
    /**
     * @description
     * For the case of markdown it is the heading text without the `#`.
     * For the case of html it is the `textContent` of the heading element.
     */
    textContent: string;
}): string {
    const { textContent } = _;
    let toReturn = textContent
        .toLowerCase()
        .replace(/[^\w -]/gu, "")
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
