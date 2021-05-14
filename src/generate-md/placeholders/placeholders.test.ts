import * as fs from "fs";
import * as path from "path";

import { constants } from "../../constants";
import { tagUnindent } from "../../es-utils/index";
import { parseCommentsFromMd } from "../../parse-comments/parseCommentsFromMd";
import { placeholders } from "./placeholders";

const { tocSpacing } = constants;
const pathToMockMd = "./mock1.md";
const absolutePathToMockMd = path.resolve(__dirname, pathToMockMd);

const mockMd = fs.readFileSync(absolutePathToMockMd, { encoding: "utf-8" });

describe(placeholders.name, () => {
    it("creates the toc placeholder taking into account all the injected files", () => {
        const md = tagUnindent`
            # hello world

            <!--#region toc-->

                to be deleted

            <!--#endregion toc-->

            ## hello kitty

            <!--#region examples ./mock1.md-->

                to be deleted
            
            <!--#endregion examples-->

            <h3>hello bob</h3>
        `;
        const parsedComments = parseCommentsFromMd(md, __dirname);
        // prettier-ignore
        expect(placeholders(md, parsedComments)).toEqual([
            `${tocSpacing.repeat(2 - 2)}- [hello kitty](#hello-kitty)` + "\n" +
            `${tocSpacing.repeat(2 - 2)}- [hello world from mock](#hello-world-from-mock)` + "\n" +
            `${tocSpacing.repeat(3 - 2)}- [hello bob](#hello-bob)`
            ,
            mockMd,
        ]);
    });
    it("wraps the placeholder in a code block when the path starts with an exclamation mark", () => {
        const md = tagUnindent`
            ## hello kitty

            <!--#region examples !./mock1.md-->

                to be deleted

            <!--#endregion examples-->
        `;
        const parsedComments = parseCommentsFromMd(md, __dirname);
        expect(placeholders(md, parsedComments)).toEqual([
            tagUnindent`
                \`\`\`md
                ${[mockMd]}
                \`\`\`
            `,
        ]);
    });
    it("wraps the placeholder in a code block with more back ticks when the path starts with more than one exclamation mark", () => {
        const md = tagUnindent`
            ## hello kitty

            <!--#region examples !!./mock1.md-->

                to be deleted

            <!--#endregion examples-->
        `;
        const parsedComments = parseCommentsFromMd(md, __dirname);
        expect(placeholders(md, parsedComments)).toEqual([
            tagUnindent`
                \`\`\`\`md
                ${[mockMd]}
                \`\`\`\`
            `,
        ]);
    });
});
