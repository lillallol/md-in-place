import { ParsedEndComment } from "./ParsedEndComment";

export class ParsedStartComment extends ParsedEndComment {
    absolutePath: string;
    exclamationMarks: string;
    constructor(_: ParsedStartComment) {
        const { exclamationMarks, absolutePath, endOffset, keyword, startOffset, line ,indent} = _;
        super({
            endOffset,
            keyword,
            startOffset,
            line,
            indent
        });
        this.absolutePath = absolutePath;
        this.exclamationMarks = exclamationMarks;
    }
}
