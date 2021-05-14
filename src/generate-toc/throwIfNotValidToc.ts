import { parsedHeading } from "../types";
import { errorMessages } from "../errorMessages";

export function throwIfNotValidToc(parsedHeadings: parsedHeading[]): void {
    let lastDepth: number = parsedHeadings[0].depth;
    let lastTitle: string = parsedHeadings[0].title;

    for (let i = 1; i < parsedHeadings.length; i++) {
        const { depth: currentDepth, title: currentTitle } = parsedHeadings[i];

        if (currentDepth === 1) throw Error(errorMessages.badPlaceForH1);
        if (currentDepth - lastDepth > 1) {
            throw Error(errorMessages.badConsecutiveHeadings(lastTitle, currentTitle));
        }
        lastDepth = currentDepth;
        lastTitle = currentTitle;
    }
}
