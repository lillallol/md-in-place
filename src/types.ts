import type { ParsedEndComment } from "./parse-comments/ParsedEndComment";
import type { ParsedEndTocComment } from "./parse-comments/ParsedEndTocComment";
import type { ParsedStartComment } from "./parse-comments/ParsedStartComment";
import type { ParsedStartTocComment } from "./parse-comments/ParsedStartTocComment";

export type parsedHeading = {
    id: string;
    number: number;
    title: string;
};

export type parsedComment = ParsedEndComment | ParsedStartComment | ParsedStartTocComment | ParsedEndTocComment;