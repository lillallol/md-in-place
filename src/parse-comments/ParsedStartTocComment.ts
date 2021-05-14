import { ParsedEndComment } from "./ParsedEndComment";

export class ParsedStartTocComment extends ParsedEndComment {
    type: "start";
    collapse: boolean;
    constructor(_: ParsedEndComment & { collapse: boolean }) {
        const { keyword, startOffset, endOffset, line, indent, collapse } = _;
        super({ endOffset, startOffset, keyword, line, indent });
        this.type = "start";
        this.collapse = collapse;
    }
}
