import { errorMessages } from "../errorMessages";
import { tagUnindent } from "../es-utils/index";
import { throwForLinksWithRelativePaths } from "./throwForLinksWithRelativePaths";

describe(throwForLinksWithRelativePaths.name, () => {
    it("throws error when the provided markdown contains a link with relative path", () => {
        const relativeLink = "./relative/path";
        const md = tagUnindent`
            ## some title 1
            
            Some paragraph with a **[relative link](${relativeLink})**.
        `;

        expect(() => throwForLinksWithRelativePaths(md)).toThrow(
            errorMessages.encounteredLinkWithRelativePathInGeneratedMd(relativeLink)
        );
    });
    it("throws error when the provided github flavoured markdown contains an anchor tag with relative path link", () => {
        const relativeLink = "./relative/path";
        const md = tagUnindent`
            ## some title 2
            
            <p>
                Some paragraph with a <a href="${relativeLink}">relative link</a>.
            </p>
        `;

        expect(() => throwForLinksWithRelativePaths(md)).toThrow(
            errorMessages.encounteredLinkWithRelativePathInGeneratedMd(relativeLink)
        );
    });
    it("does not throw error for links with absolute paths", () => {
        const absoluteLink = "https://www.reddit.com";
        const md = tagUnindent`
            ## some title 3
            
            Some paragraph with a **[relative link](${absoluteLink})**.

            <details>
            <summary>some summary</summary>

            \`\`\`ts
            const a :number = 1;
            \`\`\`

            <p>
                Some paragraph with a <a href="${absoluteLink}">relative link</a>.
            </p>

            </details>

        `;

        expect(() => throwForLinksWithRelativePaths(md)).not.toThrow();
    });
});
