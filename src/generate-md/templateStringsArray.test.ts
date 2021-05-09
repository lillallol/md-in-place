import { tagUnindent } from "../es-utils/tagUnindent";
import { parseCommentsFromMd } from "../parse-comments/parseCommentsFromMd";
import { templateStringsArray } from "./templateStringsArray";

describe(templateStringsArray.name, () => {
    it("creates the template strings array from the provided markdown", () => {
        const md = tagUnindent`
            # hello world

            <!--#region toc-->
            
                to be deleted
            
            <!--#endregion toc-->

            ## hello kitty

            <!--#region examples ./TODO.md-->

                to be deleted

            <!--#endregion examples-->

            <h3>hello bob</h3>
        `;
        const parsedComments = parseCommentsFromMd(md, process.cwd());
        expect(templateStringsArray(md, parsedComments)).toEqual([
            tagUnindent`
                # hello world

                <!--#region toc-->
            `,
            tagUnindent`
                <!--#endregion toc-->

                ## hello kitty

                <!--#region examples ./TODO.md-->
            `,
            tagUnindent`
                <!--#endregion examples-->
                
                <h3>hello bob</h3>
            `,
        ]);
    });
    it("works for indented comment",() => {
        const md = tagUnindent`
            -   a list for indentation

                <!--#region toc-->

                    to be deleted

                <!--#endregion toc-->
        `;
        const parsedComments = parseCommentsFromMd(md, process.cwd());
        expect(templateStringsArray(md, parsedComments)).toEqual([
            tagUnindent`
            -   a list for indentation

                <!--#region toc-->
            `,
            "    <!--#endregion toc-->"
        ]);
    })
});
