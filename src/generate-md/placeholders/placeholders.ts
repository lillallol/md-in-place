import * as fs from "fs";
import * as path from "path";

import { parsedComment } from "../../types";
import { ParsedStartComment } from "../../parse-comments/ParsedStartComment";
import { generateToc } from "../../generate-toc/generateToc";
import { templateStringsArray } from "../templateStringsArray";
import { ParsedStartTocComment } from "../../parse-comments/ParsedStartTocComment";
import { internalErrorMessages } from "../../errorMessages";

//@TODO the code here can be more expectable
export function placeholders(md: string, parsedCommentsValidated: parsedComment[]): string[] {
    let shouldGenerateToc = false;
    const placeholdersWithoutToc: (string | null)[] = parsedCommentsValidated
        .filter((_, i) => i % 2 === 0)
        .map((_) => {
            // given that the parsed comments are validated, then the even indexes correspond to only start comments
            if (_ instanceof ParsedStartTocComment) {
                shouldGenerateToc = true;
                return null;
            }
            if (_ instanceof ParsedStartComment) {
                const { absolutePath, shouldCodeBlock } = _;
                const file = fs.readFileSync(absolutePath, { encoding: "utf-8" });

                const fileExtension = path.extname(absolutePath).slice(1);

                //@TODO have to throw for strange cases of file extension

                const toInject = shouldCodeBlock ? `\`\`\`${fileExtension}\n${file}\n\`\`\`` : file;
                return toInject;
            }
            throw Error(internalErrorMessages.internalLibraryError);
        });

    const template = templateStringsArray(md, parsedCommentsValidated);

    if (shouldGenerateToc) {
        const mdToGenerateTocFrom: string = template
            .map((s, i) => {
                const placeholder: null | undefined | string = placeholdersWithoutToc[i];
                if (placeholder === null || placeholder === undefined) return s;
                return s + "\n" + placeholder;
            })
            .join("\n");

        const generatedToc: string = generateToc(mdToGenerateTocFrom);

        return placeholdersWithoutToc.map<string>((placeholder) => (placeholder === null ? generatedToc : placeholder));
    }

    return placeholdersWithoutToc.map<string>((placeholder) => {
        if (placeholder === null) throw Error(internalErrorMessages.internalLibraryError);
        return placeholder;
    });
}
