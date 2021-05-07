import * as path from "path";

import { errorMessages } from "../errorMessages";
import { tagUnindent } from "../es-utils/tagUnindent";
import { parseCommentsFromMd } from "./parseCommentsFromMd";
import { throwForNotValidComments } from "./throwForNotValidComments";

describe(throwForNotValidComments.name, () => {
    it.each<
        [
            {
                md: string;
                line: number;
            }
        ]
    >([
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                `,
                line: 1,
            },
        ],
        [
            {
                md: tagUnindent`
                    <!--#region TODO ./TODO.md-->
                `,
                line: 1,
            },
        ],
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                    <!--#region TODO ./TODO.md-->
                `,
                line: 3,
            },
        ],
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                    <!--#region TODO ./TODO.md-->
                `,
                line: 5,
            },
        ],
    ])("throw errors for last stray start comment ", ({ md, line }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).toThrow(
            errorMessages.endingCommentMissing({
                startTocCommentLine: line,
            })
        );
    });
    it.each<
        [
            {
                md: string;
                line: number;
            }
        ]
    >([
        [
            {
                md: tagUnindent`
                    <!--#endregion toc-->
                `,
                line: 1,
            },
        ],
        [
            {
                md: tagUnindent`
                    <!--#endregion TODO-->
                `,
                line: 1,
            },
        ],
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                    <!--#endregion TODO ./TODO.md-->
                `,
                line: 3,
            },
        ],
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                    <!--#endregion TODO ./TODO.md-->
                `,
                line: 5,
            },
        ],
    ])("throw errors for last stray end comment ", ({ md, line }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).toThrow(
            errorMessages.startingCommentMissing({
                endTocCommentLine: line,
            })
        );
    });
    it.each<
        [
            {
                md: string;
                line: number;
            }
        ]
    >([
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#region toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                `,
                line: 2,
            },
        ],
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                `,
                line: 2,
            },
        ],
    ])("throws error when start toc comment is followed by non end toc comment", ({ md, line }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).toThrow(
            errorMessages.hasToBeEndTocComment({
                endTocCommentLine: line,
            })
        );
    });
    it.each<
        [
            {
                md: string;
                line: number;
            }
        ]
    >([
        [
            {
                md: tagUnindent`
                    <!--#endregion toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                `,
                line: 1,
            },
        ],
    ])("throws error when end toc comment is not preceded by start toc comment", ({ md, line }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).toThrow(
            errorMessages.endTocCommentWithoutStart({
                endTocCommentLine: line,
            })
        );
    });
    it.each<
        [
            {
                md: string;
                badTocCommentLine: number;
                goodTocCommentEndLine: number;
                goodTocCommentStartLine: number;
            }
        ]
    >([
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                    <!--#region toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                `,
                goodTocCommentStartLine: 1,
                goodTocCommentEndLine: 2,
                badTocCommentLine: 3,
            },
        ],
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                    <!--#endregion toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                `,
                goodTocCommentStartLine: 1,
                goodTocCommentEndLine: 2,
                badTocCommentLine: 3,
            },
        ],
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                    <!--#region toc-->
                    <!--#endregion toc-->
                `,
                goodTocCommentStartLine: 1,
                goodTocCommentEndLine: 2,
                badTocCommentLine: 5,
            },
        ],
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                    <!--#endregion toc-->
                    <!--#endregion toc-->
                `,
                goodTocCommentStartLine: 1,
                goodTocCommentEndLine: 2,
                badTocCommentLine: 5,
            },
        ],
    ])(
        "throws error when toc has been already defined but a new toc comment comment is encountered",
        ({ md, badTocCommentLine, goodTocCommentEndLine, goodTocCommentStartLine }) => {
            expect(() => parseCommentsFromMd(md, process.cwd())).toThrow(
                errorMessages.tocAlreadyDefined({
                    badTocCommentLine,
                    goodTocCommentStartLine,
                    goodTocCommentEndLine,
                })
            );
        }
    );
    it.each<
        [
            {
                md: string;
                endCommentKeyword: string;
                startCommentKeyword: string;
                endCommentLine: number;
                startCommentLine: number;
            }
        ]
    >([
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion does-not-exist-->
                `,
                startCommentKeyword: "TODO",
                endCommentKeyword: "does-not-exist",
                startCommentLine: 3,
                endCommentLine: 4,
            },
        ],
    ])(
        "throws error when toc has been already defined but a new toc comment comment is encountered",
        ({ md, startCommentLine, endCommentLine, startCommentKeyword, endCommentKeyword }) => {
            expect(() => parseCommentsFromMd(md, process.cwd())).toThrow(
                errorMessages.commentRegionDoesNotHaveSameKeyword({
                    endCommentKeyword,
                    startCommentKeyword,
                    endCommentLine,
                    startCommentLine,
                })
            );
        }
    );
    it.each<[{ md: string; line: number }]>([
        [
            {
                md: tagUnindent`
                <!--#region toc-->
                <!--#endregion toc-->
                <!--#region TODO ./TODO.md-->
                <!--#region TODO ./TODO.md-->
                <!--#endregion TODO-->
                <!--#region TODO ./TODO.md-->
            `,
                line: 4,
            },
        ],
    ])("throws error when start import comment is not followed by end comment", ({ line, md }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).toThrow(
            errorMessages.hasToBeEndComment({ endCommentLine: line })
        );
    });
    it.each<[{ md: string; line: number }]>([
        [
            {
                md: tagUnindent`
            <!--#region toc-->
            <!--#endregion toc-->
            <!--#endregion TODO->
            <!--#endregion TODO-->
            <!--#region TODO ./TODO.md-->
        `,
                line: 3,
            },
        ],
    ])("throws error when start import comment is not followed by end comment", ({ line, md }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).toThrow(
            errorMessages.hasToBeStartComment({ startCommentLine: line })
        );
    });
    it.each<[{ md: string }]>([
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                `,
            },
        ],
    ])("does not throw when two comment import regions have the same keyword", ({ md }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).not.toThrow();
    });
    it.each<[{ md: string }]>([
        [
            {
                md: tagUnindent`
                    <!--#region toc-->
                    <!--#endregion toc-->
                `,
            },
        ],
    ])("does not throw when only toc comments are provided", ({ md }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).not.toThrow();
    });
    it.each<[{ md: string }]>([
        [
            {
                md: tagUnindent`
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                    <!--#region TODO ./TODO.md-->
                    <!--#endregion TODO-->
                `,
            },
        ],
    ])("does not throw when only import comments are provided", ({ md }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).not.toThrow();
    });
    it.each<[{ md: string }]>([
        [
            {
                md: tagUnindent`
            
                `,
            },
        ],
    ])("does not throw when no comments are provided", ({ md }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).not.toThrow();
    });
    it.each<[{ md: string }]>([
        [
            {
                md: tagUnindent`
                    <!--#region TODO ./does-not-exist.md-->
                    <!--#endregion TODO -->
                `,
            },
        ],
    ])("throws error when import path does not exist", ({ md }) => {
        expect(() => parseCommentsFromMd(md, process.cwd())).toThrow(
            errorMessages.relativePathOfFileToInjectCanNotBeAccessed(path.resolve(process.cwd(), "./does-not-exist.md"))
        );
    });
});
