export class ParsedEndComment {
    keyword: string;
    endOffset: number;
    startOffset: number;
    /**
     * @description
     * This is only used in error messages.
     */
    line: number;

    constructor(_: ParsedEndComment) {
        const { startOffset, endOffset, keyword, line } = _;
        this.endOffset = endOffset;
        this.keyword = keyword;
        this.startOffset = startOffset;
        this.line = line;
    }
}
