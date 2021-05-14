export const constants: {
    readonly tocSpacing: string;
    readonly commentStartKeyword: string;
    readonly commentEndKeyword: string;
    readonly tocKeyword: string;
    readonly tocCommentStartRegExpSrc: string;
    readonly tocCommentEndRegExpSrc: string;
    readonly injectTocCommentStartValueRegExp: RegExp;
    readonly injectTocCommentEndValueRegExp: RegExp;
    readonly injectFileCommentStartValueRegExp: RegExp;
    readonly injectFileCommentEndValueRegExp: RegExp;
    readonly pathRegExp: RegExp;
    readonly keywordRegExp: RegExp;
    readonly collapseKeyword : string;
} = {
    get tocSpacing() {
        return "    ";
    },
    get commentStartKeyword() {
        return "#region";
    },
    get commentEndKeyword() {
        return "#endregion";
    },
    get tocKeyword() {
        return "toc";
    },
    get collapseKeyword() {
        return "collapse";
    },
    /**
     * @description
     * This is used only in error message.
     */
    get tocCommentStartRegExpSrc() {
        return `<!--${constants.commentStartKeyword} ${constants.tocKeyword}-->`;
    },
    /**
     * @description
     * This is used only in error message.
     */
    get tocCommentEndRegExpSrc() {
        return `<!--${constants.commentEndKeyword} ${constants.tocKeyword}-->`;
    },
    /**
     * @description
     * The sole purpose of this regexp is for its source to be used in the
     * starting comment regexp for file imports.
     */
    get pathRegExp() {
        return /[.a-zA-Z/0-9-]+/;
    },
    /**
     * @description
     * The sole purpose of this regexp is for its source to be used in the
     * comment regexp for file imports.
     */
    get keywordRegExp() {
        return /[a-zA-Z-]+/;
    },
    get injectTocCommentStartValueRegExp(): RegExp {
        return RegExp(`\\s*${constants.commentStartKeyword}\\s+${constants.tocKeyword}\\s*(?<collapse>${constants.collapseKeyword})?\\s*`, "s");
    },
    get injectTocCommentEndValueRegExp(): RegExp {
        return RegExp(`\\s*${constants.commentEndKeyword}\\s+${constants.tocKeyword}\\s*`, "s");
    },
    get injectFileCommentStartValueRegExp(): RegExp {
        //prettier-ignore
        return RegExp(
            `\\s*${constants.commentStartKeyword}`+
            `\\s+(?<keyword>${constants.keywordRegExp.source})`+
            `\\s+(?<exclamationMark>!*)`+
            `(?<path>${constants.pathRegExp.source})`+
            `\\s*`,"s"
        );
    },
    get injectFileCommentEndValueRegExp(): RegExp {
        //prettier-ignore
        return RegExp(
            `\\s*${constants.commentEndKeyword}`+
            `\\s+(?<keyword>${constants.keywordRegExp.source})`+
            `\\s*`, "s"
        );
    },
};
