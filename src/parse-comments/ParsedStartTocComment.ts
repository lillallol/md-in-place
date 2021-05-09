import { ParsedEndComment } from "./ParsedEndComment";

export class ParsedStartTocComment extends ParsedEndComment {
    type: "start";
    constructor(_: ParsedEndComment) {
        const { keyword, startOffset, endOffset, line,indent } = _;
        super({ endOffset, startOffset, keyword, line ,indent});
        this.type = "start";
    }
}
