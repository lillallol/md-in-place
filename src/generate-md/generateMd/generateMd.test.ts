import * as fs from "fs";
import * as path from "path";

import { constants } from "../../constants";
import { tagUnindent } from "../../es-utils/tagUnindent";
import { headingCount } from "../../generate-toc/markdownHeadingToId";
import { generateMd } from "./generateMd";

const { tocSpacing } = constants;

const absolutePathToMdMock: string = path.resolve(__dirname, "./1.mock.md");
const absolutePathToTsMock: string = path.resolve(__dirname, "./1.mock.ts");
const mdMock: string = fs.readFileSync(absolutePathToMdMock, { encoding: "utf-8" });
const tsMock: string = fs.readFileSync(absolutePathToTsMock, { encoding: "utf-8" });

beforeEach(() => {
    Object.keys(headingCount).forEach((key) => delete headingCount[key]);
});

describe(generateMd.name, () => {
    it("generates the markdown when both toc and file import comments are used", () => {
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
            <!--#endregion mock-->
        `;

        const toBe: string = tagUnindent`
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

            <!--#endregion mock-->
        `;

        const expected: string = generateMd({ md, pathToFolderContainingMd: __dirname });
        expect(expected).toBe(toBe);
    });
    it("generates the markdown when only imports comments are used", () => {
        const md = tagUnindent`
            <!--#region examples ./1.mock.md-->

            ## to be deleted

            <!--#endregion examples-->

            <!--#region mock !./1.mock.ts-->
            <!--#endregion mock>
        `;

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
    it("works properly for indented comment that has only space on its indentation, and has the same indentation as its parent list", () => {
        const md = tagUnindent`
            -   a list just for indentation

                <!--#region mock !./1.mock.ts-->

                to be deleted

                <!--#endregion mock-->
        `;
        const toBe: string = tagUnindent`
            -   a list just for indentation

                <!--#region mock !./1.mock.ts-->

                \`\`\`ts
                ${[tsMock]}
                \`\`\`

                <!--#endregion mock-->
        `;
        const expected: string = generateMd({ md, pathToFolderContainingMd: __dirname });
        expect(expected).toBe(toBe);
    });
    it("works properly for indented comment that has only space on its indentation, and does not have the same indentation as its parent list", () => {
        const md = tagUnindent`
            - a list just for indentation

                <!--#region mock !./1.mock.ts-->

                to be deleted

                <!--#endregion mock-->
        `;
        const toBe: string = tagUnindent`
            - a list just for indentation

                <!--#region mock !./1.mock.ts-->

                \`\`\`ts
                ${[tsMock]}
                \`\`\`

                <!--#endregion mock-->
        `;
        const expected: string = generateMd({ md, pathToFolderContainingMd: __dirname });
        expect(expected).toBe(toBe);
    });
    it("works properly for indented comment that does not has only space on its indentation", () => {
        const md = tagUnindent`
            -  <!--#region mock !./1.mock.ts-->

               to be deleted

               <!--#endregion mock-->
        `;
        const toBe: string = tagUnindent`
            -  <!--#region mock !./1.mock.ts-->

               \`\`\`ts
               ${[tsMock]}
               \`\`\`

               <!--#endregion mock-->
        `;
        const expected: string = generateMd({ md, pathToFolderContainingMd: __dirname });
        expect(expected).toBe(toBe);
    });
});
