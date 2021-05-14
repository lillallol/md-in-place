import { tagUnindent } from "../es-utils/index";
import { getIndentForComment } from "./getIndentForComment";

type toBe = ReturnType<typeof getIndentForComment>;

describe(getIndentForComment.name, () => {
    it("returns the indent string of the provided special comment", () => {
        const md: string = tagUnindent`
            -   a list just for indentation

                <!--#region mock !./1.mock.ts-->

                to be deleted

                <!--#endregion mock-->

        `;

        const startOffset = md.indexOf("<!--");
        const expected = getIndentForComment({ md, startOffset });
        const toBe: toBe = {
            indent: "    ",
            trimmedStartStartOffset: startOffset,
        };
        expect(expected).toEqual(toBe);
    });
    it("returns the indent string of the provided special comment", () => {
        const md: string = tagUnindent`
            - a list just for indentation

                <!--#region mock !./1.mock.ts-->

                to be deleted

                <!--#endregion mock-->

        `;

        const startOffset = md.indexOf("<!--");
        const expected = getIndentForComment({ md, startOffset });
        const toBe: toBe = {
            indent: "    ",
            trimmedStartStartOffset: startOffset,
        };
        expect(expected).toEqual(toBe);
    });
    it("returns the indent string of the comment when it does not only have spaces for indentation", () => {
        const md: string = tagUnindent`
            -   <!--#region mock !./1.mock.ts-->

                to be deleted

                <!--#endregion mock-->

        `;

        const startOffset = md.indexOf("<!--");
        const expected = getIndentForComment({ md, startOffset });
        const toBe: toBe = {
            indent: "    ",
            trimmedStartStartOffset: startOffset,
        };
        expect(expected).toEqual(toBe);
    });
});
