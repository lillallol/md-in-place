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
    const placeholdersWithoutToc: (string | null)[] = parsedCommentsValidated
        .filter((_, i) => i % 2 === 0)
        .map((_) => {
            // given that the parsed comments are validated, then the even indexes correspond to only start comments
            if (_ instanceof ParsedStartTocComment) {
                return null;
            }
            if (_ instanceof ParsedStartComment) {
                const { absolutePath, exclamationMarks, indent } = _;
                const file = fs.readFileSync(absolutePath, { encoding: "utf-8" });

                const fileExtension = path.extname(absolutePath).slice(1);

                //@TODO have to throw for strange cases of file extension
                const toInject = (() => {
                    if (exclamationMarks.length !== 0) {
                        const backTicks = "`".repeat(2 + exclamationMarks.length);

                        return `${backTicks}${fileExtension}\n${file}\n${backTicks}`;
                    }
                    return file;
                })();
                return toInject
                    .split("\n")
                    .map((line) => indent + line)
                    .join("\n");
            }
            throw Error(internalErrorMessages.internalLibraryError);
        });

    //@TODO this has to go on its own file
    const isParsedTocComment = (v: unknown): v is ParsedStartTocComment => v instanceof ParsedStartTocComment;
    const parsedStartTocComment: ParsedStartTocComment | undefined = parsedCommentsValidated.find(isParsedTocComment);

    const template = templateStringsArray(md, parsedCommentsValidated);

    if (parsedStartTocComment !== undefined) {
        const { indent, collapse } = parsedStartTocComment;
        const mdToGenerateTocFrom: string = template
            .map((s, i) => {
                const placeholder: null | undefined | string = placeholdersWithoutToc[i];
                if (placeholder === null || placeholder === undefined) return s;
                return s + "\n" + placeholder;
            })
            .join("\n");

        const generatedToc: string = generateToc({ md: mdToGenerateTocFrom, indent, collapse });

        return placeholdersWithoutToc.map<string>((placeholder) => (placeholder === null ? generatedToc : placeholder));
    }

    return placeholdersWithoutToc.map<string>((placeholder) => {
        if (placeholder === null) throw Error(internalErrorMessages.internalLibraryError);
        return placeholder;
    });
}
