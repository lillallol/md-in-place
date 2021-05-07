import { constants } from "../../constants";
import { tagUnindent } from "../../es-utils/tagUnindent";
import { parseCommentsFromMd } from "../../parse-comments/parseCommentsFromMd";
import { placeholders } from "./placeholders";

const { tocSpacing } = constants;

describe(placeholders.name, () => {
    it("creates the placeholders properly, especially the toc after all the files have been injected", () => {
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
        expect(placeholders(md, parsedComments)).toEqual([
            tagUnindent`
                ${tocSpacing.repeat(1 - 1)}- [hello world](#hello-world)
                ${tocSpacing.repeat(2 - 1)}- [hello kitty](#hello-kitty)
                ${tocSpacing.repeat(2 - 1)}- [hello world from mock](#hello-world-from-mock)
                ${tocSpacing.repeat(3 - 1)}- [hello bob](#hello-bob)
            `,
            tagUnindent`
                ## hello world from mock
            `,
        ]);
    });
});
