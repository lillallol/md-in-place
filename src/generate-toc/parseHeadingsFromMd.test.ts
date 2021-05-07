import { tagUnindent } from "../es-utils/tagUnindent";
import { parsedHeading } from "../types";
import { parseHeadingsFromMd } from "./parseHeadingsFromMd";

describe(parseHeadingsFromMd.name, () => {
    it("parses the headings from the markdown it is provided", () => {
        const md = tagUnindent`
            ## hello world

            <h3 id="my-id">hello kitty</h3>

            ### **[Hello Bob](./a/path/some/where)**

            \`\`\`
            # bash comment
            \`\`\`

            <code>
            # mean comment
            </code>

            <code>
            &lt;h1&gt;some heading&lt;/h1&gt;
            </code>

            \`\`\`
            <h1>text</h1>
            \`\`\`

            <h4>bye bye</h4>
        `;
        expect(parseHeadingsFromMd(md)).toEqual<parsedHeading[]>([
            {
                number: 2,
                id: "hello-world",
                title: "hello world",
            },
            {
                number: 3,
                id: "my-id",
                title: "hello kitty",
            },
            {
                number: 3,
                id: "hello-bob",
                title: "Hello Bob",
            },
            {
                number : 4,
                id : "bye-bye",
                title : "bye bye"
            }
        ]);
    });
});
