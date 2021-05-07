import { ParsedEndComment } from "./ParsedEndComment";

export class ParsedStartTocComment extends ParsedEndComment {
    type: "start";
    constructor(_: ParsedEndComment) {
        const { keyword, startOffset, endOffset, line } = _;
        super({ endOffset, startOffset, keyword, line });
        this.type = "start";
    }
}
