import { parsedHeading } from "../types";
import { errorMessages } from "../errorMessages";

export function throwIfNotValidToc(parsedHeadings: parsedHeading[]): void {
    let lastDepth: number = parsedHeadings[0].number;
    let lastTitle: string = parsedHeadings[0].title;

    const lastId: string = parsedHeadings[0].id;
    const idsSet: Set<string> = new Set([lastId]);

    for (let i = 1; i < parsedHeadings.length; i++) {
        const { number: currentDepth, title: currentTitle, id } = parsedHeadings[i];
        if (idsSet.has(id)) throw Error(errorMessages.idIsAlreadyUsed(id));
        idsSet.add(id);
        if (currentDepth === 1) throw Error(errorMessages.badPlaceForH1);
        if (currentDepth - lastDepth > 1) {
            throw Error(errorMessages.badConsecutiveHeadings(lastTitle, currentTitle));
        }
        lastDepth = currentDepth;
        lastTitle = currentTitle;
    }
}
