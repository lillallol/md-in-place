import * as fs from "fs";
import * as path from "path";

import { constants } from "../../constants";
import { tagUnindent } from "../../es-utils/tagUnindent";
import { generateMd } from "./generateMd";

const { tocSpacing } = constants;

//@TODO have to test that the code blocks add extension for the paths that start !
describe(generateMd.name, () => {
    it("generates the markdown when both toc and import comments are used", () => {
        const md = tagUnindent`
            # hello world

            <!--#region toc-->
            
            ## to be deleted
            
            <!--#endregion toc-->

            ## hello kitty

            <code>
            &lt;!--#region keyword !./som/path--&gt;
            </code>

            \`\`\`
            ## hello kitty
            <!--#region examples ./1.mock.md-->
            \`\`\`

            <!--#region examples ./1.mock.md-->

            ## to be deleted

            <!--#endregion examples-->

            <h3>hello bob</h3>

            <!--#region mock !./1.mock.ts-->
            <!--#endregion mock>
        `;
        const absolutePathToMdMock: string = path.resolve(__dirname, "./1.mock.md");
        const absolutePathToTsMock: string = path.resolve(__dirname, "./1.mock.ts");
        const mdMock: string = fs.readFileSync(absolutePathToMdMock, { encoding: "utf-8" });
        const tsMock: string = fs.readFileSync(absolutePathToTsMock, { encoding: "utf-8" });

        expect(generateMd({ md, pathToFolderContainingMd: __dirname })).toBe(
            tagUnindent`
                # hello world

                <!--#region toc-->

                ${tocSpacing.repeat(1 - 1)}- [hello world](#hello-world)
                ${tocSpacing.repeat(2 - 1)}- [hello kitty](#hello-kitty)
                ${tocSpacing.repeat(2 - 1)}- [hello world from mock](#hello-world-from-mock)
                ${tocSpacing.repeat(3 - 1)}- [hello bob](#hello-bob)

                <!--#endregion toc-->

                ## hello kitty

                <code>
                &lt;!--#region keyword !./som/path--&gt;
                </code>
    
                \`\`\`
                ## hello kitty
                <!--#region examples ./1.mock.md-->
                \`\`\`

                <!--#region examples ./1.mock.md-->

                ${[mdMock]}

                <!--#endregion examples-->

                <h3>hello bob</h3>

                <!--#region mock !./1.mock.ts-->

                \`\`\`ts
                ${[tsMock]}
                \`\`\`

                <!--#endregion mock>
            `
        );
    });
    it("generates the markdown when only imports comments are used", () => {
        const md = tagUnindent`
            <!--#region examples ./1.mock.md-->

            ## to be deleted

            <!--#endregion examples-->

            <!--#region mock !./1.mock.ts-->
            <!--#endregion mock>
        `;
        const absolutePathToMdMock: string = path.resolve(__dirname, "./1.mock.md");
        const absolutePathToTsMock: string = path.resolve(__dirname, "./1.mock.ts");
        const mdMock: string = fs.readFileSync(absolutePathToMdMock, { encoding: "utf-8" });
        const tsMock: string = fs.readFileSync(absolutePathToTsMock, { encoding: "utf-8" });

        expect(generateMd({ md, pathToFolderContainingMd: __dirname })).toBe(
            tagUnindent`
                <!--#region examples ./1.mock.md-->

                ${[mdMock]}

                <!--#endregion examples-->

                <!--#region mock !./1.mock.ts-->

                \`\`\`ts
                ${[tsMock]}
                \`\`\`

                <!--#endregion mock>
            `
        );
    });
    it("generates the markdown when no comments are used", () => {
        const md = tagUnindent`
            ## hello world
        `;

        expect(generateMd({ md, pathToFolderContainingMd: __dirname })).toBe(md);
    });
    it("generates the markdown when only toc comments are used", () => {
        const md = tagUnindent`
            <!--#region toc-->

            ## to be deleted

            <!--#endregion toc-->

            ## hello world
        `;

        expect(generateMd({ md, pathToFolderContainingMd: __dirname })).toBe(tagUnindent`
            <!--#region toc-->

            ${tocSpacing.repeat(2 - 1 - 1)}- [hello world](#hello-world)

            <!--#endregion toc-->

            ## hello world
        `);
    });
});
