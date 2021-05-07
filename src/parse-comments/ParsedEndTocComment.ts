import { ParsedEndComment } from "./ParsedEndComment";

export class ParsedEndTocComment extends ParsedEndComment {
    type: "end";
    constructor(_: ParsedEndComment) {
        const { keyword, startOffset, endOffset,line } = _;
        super({ endOffset, startOffset, keyword, line});
        this.type = "end";
    }
}