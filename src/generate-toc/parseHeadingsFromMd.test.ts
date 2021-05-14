import { tagUnindent } from "../es-utils/index";
import { parsedHeadingWithIndex } from "../types";
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
        expect(parseHeadingsFromMd(md)).toEqual<parsedHeadingWithIndex[]>([
            {
                depth: 2,
                title: "hello world",
                id: "hello-world",
                index: 0,
            },
            {
                depth: 3,
                title: "hello kitty",
                id: "hello-kitty",
                index: 1,
            },
            {
                depth: 3,
                title: "Hello Bob",
                id: "hello-bob",
                index: 2,
            },
            {
                depth: 4,
                title: "bye bye",
                id: "bye-bye",
                index: 3,
            },
        ]);
    });
});
