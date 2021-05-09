export function getIndentForComment(_: {
    /**
     * @description
     * The markdown as a string.
     */
    md: string;
    /**
     * @description
     * The start offset that the ast gives to the comment.
     */
    startOffset: number;
}): {
    /**
     * @description
     * The start offset without the indentation.
     */
    trimmedStartStartOffset: number;
    /**
     * @description
     * The ident of the comment.
     *
     * For the following example:
     *
     * ```md
     * -  <!--#region mock !./1.mock.ts-->
     * ```
     *
     * the calculated indentation is:
     *
     * ```ts
     * "-  ".map(() => " ");
     * ```
     *
     * and for the following example:
     *
     * ```md
     * - a list just for indentation
     *
     *    <!--#region mock !./1.mock.ts-->
     * ```
     *
     * the calculated indentations is:
     *
     * ```ts
     * ("- " + "  ").map(() => " ");
     * ```
     *
     * The indentation is needed for two reasons:
     *
     * * indent the placeholder the same way as its wrapping comment is indented
     * * add proper indentation in the end comments of template string array elements
     *
     */
    indent: string;
} {
    const { md } = _;
    let { startOffset } = _;
    let indent = "";

    /**
     * @description
     * This loop calculates the indentation string of the comment that is not part of its
     * html source code.
     *
     * For the following example:
     *
     * ```md
     * -  <!--#region mock !./1.mock.ts-->
     * ```
     *
     * the calculated indentation is:
     *
     * ```ts
     * "-  ".map(() => " ");
     * ```
     *
     * The following example has indentation splitted in the html source code and out of it:
     *
     * ```md
     * - a list just for indentation
     *
     *    <!--#region mock !./1.mock.ts-->
     * ```
     *
     * the calculated indentation out of the html source code is:
     *
     * ```ts
     * "- ".map(() => " ");
     * ```
     *
     * and that is because the other two spaces `"  "` are part of the html source code and it
     * is not the responsibility of the context for loop to calculate them. Look at the last for
     * loop which is its responsibility to do that.
     */
    // @TODO are there any other character for new line except "\n"
    for (let i = startOffset - 1; i > -1 && md[i] !== "\n"; i--) {
        if (/\s/.test(md[i])) {
            indent += md[i];
            continue;
        }
        indent += " ";
    }
    /**
     * @description
     * Sometimes the html comment source code that the ast gives can be indented with
     * spaces. Here is an example:
     *
     * ```md
     * - a list just for indentation
     *
     *    <!--#region mock !./1.mock.ts-->
     * ```
     *
     * Try that in https://astexplorer.net/. Look at the start offset that the ast gives,
     * it defines where the html source code starts, and for this example it contains two
     * indented spaces. The other two spaces are out of the html source code.
     * The following for loop is changing the startOffset to not start from the html
     * source code specific indentation but to start from the comment without indentation.
     * It also adds to the indentation to return, that has been calculated from the previous
     * for loop, the html source code specific indentation.
     */
    for (let i = startOffset; /\s/.test(md[i]); i++) {
        startOffset++;
        indent += md[i];
    }

    return {
        indent,
        trimmedStartStartOffset: startOffset,
    };
}
