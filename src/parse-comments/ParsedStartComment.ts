import { ParsedEndComment } from "./ParsedEndComment";

export class ParsedStartComment extends ParsedEndComment {
    absolutePath: string;
    shouldCodeBlock: boolean;
    constructor(_: ParsedStartComment) {
        const { shouldCodeBlock, absolutePath, endOffset, keyword, startOffset, line } = _;
        super({
            endOffset,
            keyword,
            startOffset,
            line,
        });
        this.absolutePath = absolutePath;
        this.shouldCodeBlock = shouldCodeBlock;
    }
}
