import { tagUnindent } from "../es-utils/index";
import { parseCommentsFromMd } from "./parseCommentsFromMd";

//@TODO this test does not test the full interface. This can bite really hard in the future
describe(parseCommentsFromMd.name, () => {
    it("parses the 0 dom depth comments for toc and file injection from the html fragments", () => {
        const md = tagUnindent`
            
            <!--#region toc-->
            <!--#endregion toc-->

            <code>

            $lt;!--#region bad ./path/to/bad.ts--&gt;
            
            these comments are not parsed since they are not real html
            
            $lt;!--#endregion bad--&gt;

            </code>

            <!--#region examples ./TODO.md-->
            <!--#endregion examples-->

            \`\`\`html

            <!--#region bad ./path/to/bad.ts-->

            the comments in this code block are not parsed, because this code
            block is not treated as html

            <!--#endregion bad-->

            \`\`\`

            <details>
                <summary>
                    The context details region is parsed as 4 html fragments 
                    because of the empty lines. Because of that the comments are 
                    parsed, since they are of 0 dom depth in their html 
                    fragment.
                </summary>

            <!--#region documentation ./TODO.md-->

            <!--#endregion documentation-->

            </details>

            <div>
                <p>
                    The comments wrapped by the context div will not be parsed 
                    because they are not of 0 dom depth in the context html 
                    fragment.
                </p>
            <!--#region toc-->
            <!--#endregion toc-->
            </div>

            <!-- this and the next comment are ignored -->
            <!---->

            <!--#region documentation !./src/index.ts-->

                This comment will add markdown code block of ts type on the file
                it imports. That is because the path starts with !.

            <!--#endregion documentation-->
        `;
        expect(parseCommentsFromMd(md, process.cwd()).length).toBe(8);
    });
    it("parses toc comments thats inside markdown lists properly", () => {
        const md = tagUnindent`
            -   This is a markdown list
            
                <!--#region toc-->

                <!--#endregion toc-->
        `;
        expect(
            parseCommentsFromMd(md, process.cwd()).map(({ indent, line }) => ({
                indent,
                line,
            }))
        ).toEqual([
            { indent: "    ", line: 3 },
            { indent: "    ", line: 5 },
        ]);
    });
    it("parses comments thats inside markdown lists properly", () => {
        const md = tagUnindent`
            -   a list just for indentation

                <!--#region mock !./TODO.md-->

                to be deleted

                <!--#endregion mock-->
        `;
        expect(
            parseCommentsFromMd(md, process.cwd()).map(({ indent, line }) => ({
                indent,
                line,
            }))
        ).toEqual([
            { indent: "    ", line: 3 },
            { indent: "    ", line: 7 },
        ]);
    });
});
