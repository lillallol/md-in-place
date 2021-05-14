import { errorMessages } from "../errorMessages";
import { tagUnindent } from "../es-utils/index";
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
            { depth: 1, title: "heading 1" },
            { depth: 2, title: "heading 2" },
            { depth: 3, title: "My Heading 3" },
            { depth: 4, title: "My Heading 4" },
            { depth: 5, title: "My Heading 5" },
            { depth: 6, title: "My Heading 6" },
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
    it("throws error when the heading has bad id pattern", () => {
        const id = "inject/generate";
        const html: string = tagUnindent`
            <h1>${id}</h1>
        `;
        expect(() => htmlFragmentToParsedHeadings(html)).not.toThrow();
    });
});
