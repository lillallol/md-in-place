import { errorMessages } from "../errorMessages";
import { tagUnindent } from "../es-utils/tagUnindent";
import { parsedHeading } from "../types";
import { htmlFragmentToParsedHeadings } from "./htmlFragmentToParsedHeadings";

describe(htmlFragmentToParsedHeadings.name, () => {
    it("extracts the html headings from the provided html fragment", () => {
        const html: string = tagUnindent`
            <h1 id="my-id">heading 1</h1>
            <div>
                <h2 id="">heading 2</h2>
            </div>
            <h3>My Heading 3</h3>
            <h4>My Heading 4</h4>
            <h5>My Heading 5</h5>
            <h6>My Heading 6</h6>
        `;
        const parsedHeadings = htmlFragmentToParsedHeadings(html);
        expect(parsedHeadings).toEqual<parsedHeading[]>([
            { number: 1, id: "my-id", title: "heading 1" },
            { number: 2, id: "heading-2", title: "heading 2" },
            { number: 3, id: "my-heading-3", title: "My Heading 3" },
            { number: 4, id: "my-heading-4", title: "My Heading 4" },
            { number: 5, id: "my-heading-5", title: "My Heading 5" },
            { number: 6, id: "my-heading-6", title: "My Heading 6" },
        ]);
    });
    it.each<
        [
            {
                html: string;
            }
        ]
    >([
        [
            {
                html: tagUnindent`
                    <h1 id="">  </h1>
                `,
            },
        ],
        [
            {
                html: tagUnindent`
                    <h1 id="my-id">  </h1>
                `,
            },
        ],
        [
            {
                html: tagUnindent`
                    <h6>  </h6>
                `,
            },
        ],
        [
            {
                html: tagUnindent`
                    <h5></h5>
                `,
            },
        ],
    ])("throws error when a text less heading is encountered", ({ html }) => {
        expect(() => htmlFragmentToParsedHeadings(html)).toThrow(errorMessages.encounteredTextLessHeading(html));
    });
});
