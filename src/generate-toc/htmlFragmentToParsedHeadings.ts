import { JSDOM } from "jsdom";
import { errorMessages, internalErrorMessages } from "../errorMessages";
import { parsedHeading } from "../types";

export function htmlFragmentToParsedHeadings(html: string): parsedHeading[] {
    return [...JSDOM.fragment(html).querySelectorAll("h1,h2,h3,h4,h5,h6")].map<parsedHeading>((h) => {
        const title: string = (() => {
            const toReturn = h.textContent;
            if (toReturn === null || toReturn.trim().length === 0) {
                throw Error(errorMessages.encounteredTextLessHeading(h.outerHTML));
            }
            return toReturn;
        })();

        const number: number = (() => {
            if (h.tagName === "H1") return 1;
            if (h.tagName === "H2") return 2;
            if (h.tagName === "H3") return 3;
            if (h.tagName === "H4") return 4;
            if (h.tagName === "H5") return 5;
            if (h.tagName === "H6") return 6;
            throw Error(internalErrorMessages.internalLibraryError);
        })();
        return {
            depth: number,
            title,
        };
    });
}
