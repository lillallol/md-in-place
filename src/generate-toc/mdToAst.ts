import * as remark from "remark";
import * as remarkParse from "remark-parse"; // parses md to syntax tree
import * as remarkGfm from "remark-gfm"; // github flavoured markdown see the following link on how to use : https://github.com/remarkjs/remark-gfm#use

export function mdToAst(
    md: string
): {
    children: {
        type: "html" | "heading";
        position: {
            start: {
                line: number;
                offset: number;
            };
            end: {
                line: number;
                offset: number;
            };
        };
    }[];
} {
    //@TODO find a way to get proper intellisense about that
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return remark().use(remarkParse).use(remarkGfm).parse(md);
}
