import { parseCommentsFromMd } from "../../parse-comments/parseCommentsFromMd";
import { placeholders } from "../placeholders/placeholders";
import { templateStringsArray } from "../templateStringsArray";

export function generateMd(_: { md: string; pathToFolderContainingMd: string }): string {
    const { md, pathToFolderContainingMd } = _;
    const parsedComments = parseCommentsFromMd(md, pathToFolderContainingMd);

    const _placeholders = placeholders(md, parsedComments);
    const _templateStringsArray = templateStringsArray(md, parsedComments);

    let toReturn: string = "";
    for (let i = 0; i < _placeholders.length; i++) {
        toReturn += _templateStringsArray[i] + "\n\n" + _placeholders[i] + "\n\n";
    }
    toReturn += _templateStringsArray[_templateStringsArray.length - 1];

    return toReturn;
}
