import { constants } from "../constants";
import { tagUnindent } from "../es-utils/index";
import { generateToc } from "./generateToc";

describe(generateToc.name, () => {
    it("generates toc for the provided markdown file", () => {
        const md = tagUnindent`
            # hello world

            <h2 id="my-id">
            hello kitty
            </h2>

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
        expect(generateToc({ md,indent,collapse : false})).toBe(
            `${indent}${tocSpacing.repeat(2-2)}- [hello kitty](#hello-kitty)` + "\n" +
            `${indent}${tocSpacing.repeat(2-2)}- [Hello Bob](#hello-bob)` + "\n" +
            `${indent}${tocSpacing.repeat(3-2)}- [bye bye](#bye-bye)`
        );
    });
});
