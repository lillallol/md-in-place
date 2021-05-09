import { constants } from "../constants";
import { tagUnindent } from "../es-utils/tagUnindent";
import { generateToc } from "./generateToc";

describe(generateToc.name, () => {
    it("generates toc for the provided markdown file", () => {
        const md = tagUnindent`
            # hello world

            <h2 id="my-id">hello kitty</h2>

            ## **[Hello Bob](./a/path/some/where)**

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

            <h3>bye bye</h3>
        `;
        const { tocSpacing } = constants;
        const indent: string = "    ";
        // prettier-ignore
        expect(generateToc(md,indent)).toBe(
            `${indent}${tocSpacing.repeat(1-1)}- [hello world](#hello-world)` + "\n" +
            `${indent}${tocSpacing.repeat(2-1)}- [hello kitty](#my-id)` + "\n" +
            `${indent}${tocSpacing.repeat(2-1)}- [Hello Bob](#hello-bob)` + "\n" +
            `${indent}${tocSpacing.repeat(3-1)}- [bye bye](#bye-bye)`
        );
    });
});
