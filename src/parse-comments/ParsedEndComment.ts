export class ParsedEndComment {
    /**
     * @description
     * The custom keyword of the comment.
     *
     * Here is an example:
     *
     * ```md
     * <!--#endregion custom-keyword-->
     * ```
     */
    keyword: string;
    /**
     * @description
     * @todo
     * add description
     */
    startOffset: number;
    /**
     * @description
     * @todo
     * add description
     */
    endOffset: number;
    /**
     * @description
     * @todo
     * add description
     */
    indent: string;
    /**
     * @description
     * This is the line of the comment, which is calculated by treating markdown
     * as a javascript string split by "\n". Although the the first index is 1
     * rather than 0.
     *
     * This is only used in error messages.
     */
    line: number;

    constructor(_: ParsedEndComment) {
        const { startOffset, endOffset, keyword, line, indent } = _;
        this.endOffset = endOffset;
        this.keyword = keyword;
        this.startOffset = startOffset;
        this.line = line;
        this.indent = indent;
    }
}
