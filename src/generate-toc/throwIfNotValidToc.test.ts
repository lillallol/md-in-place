import { errorMessages } from "../errorMessages";
import { tagUnindent } from "../es-utils/tagUnindent";
import { toKebab } from "../es-utils/toKebab";
import { parseHeadingsFromMd } from "./parseHeadingsFromMd";
import { throwIfNotValidToc } from "./throwIfNotValidToc";

describe(throwIfNotValidToc.name, () => {
    it("throws error when provided with toc with bad consecutive toc nodes", () => {
        const title1 = "hello world";
        const title2 = "hello bob";

        const invalidTocMd = tagUnindent`
            ## ${title1}

            #### ${title2}
        `;

        const parsedHeadings = parseHeadingsFromMd(invalidTocMd);

        expect(() => throwIfNotValidToc(parsedHeadings)).toThrow(errorMessages.badConsecutiveHeadings(title1, title2));
    });
    it("throws error when provided with toc that has h1 not as first heading", () => {
        const title1 = "hello world";
        const title2 = "hello bob";

        const invalidTocMd = tagUnindent`
            ## ${title1}

            # ${title2}
        `;

        const parsedHeadings = parseHeadingsFromMd(invalidTocMd);

        expect(() => throwIfNotValidToc(parsedHeadings)).toThrow(errorMessages.badPlaceForH1);
    });
    it("does not throw error for parsed headings of a valid toc", () => {
        const title1 = "hello world";
        const title2 = "hello bob";

        const invalidTocMd = tagUnindent`
            # ${title1}

            ## ${title2}
        `;

        const parsedHeadings = parseHeadingsFromMd(invalidTocMd);

        expect(() => throwIfNotValidToc(parsedHeadings)).not.toThrow();
    });
    it("throws if an id corresponds to more than one heading", () => {
        const title1 = "hello world";
        const id = toKebab(title1);
        const invalidTocMd = tagUnindent`
            # ${title1}

            <h2 id="${id}">${title1}</h2>
        `;

        const parsedHeadings = parseHeadingsFromMd(invalidTocMd);

        expect(() => throwIfNotValidToc(parsedHeadings)).toThrow(errorMessages.idIsAlreadyUsed(id));
    });
});
