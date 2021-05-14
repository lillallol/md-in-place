import { constants } from "../constants";
import { throwIfNotValidToc } from "./throwIfNotValidToc";
import { parseHeadingsFromMd } from "./parseHeadingsFromMd";
import { parsedHeadingWithIndex } from "../types";
// import { internalErrorMessages } from "../errorMessages";
// import { tagUnindent } from "../es-utils";
// import { tocNodeHasChildrenFactory } from "./tocNodeHasChildrenFactory";
// import { getImmediateTocNodeChildrenFactory } from "./getImmediateTocNodeChildrenFactory";

export function generateToc(_: {
    /**
     * @description
     * The markdown source as a string.
     */
    md: string;
    /**
     * @description
     * Space indentation that is added for toc list node.
     */
    indent: string;
    /**
     * @description
     *
     */
    collapse: boolean;
}): string {
    const { indent, md } = _;
    const parsedHeadings = parseHeadingsFromMd(md);
    const { tocSpacing } = constants;

    const headingsWithoutDepth1Heading: parsedHeadingWithIndex[] = parsedHeadings
        .filter(({ depth }) => depth > 1) //@TODO this can be done with slice
        .map(({ depth, index, title, id }) => ({ depth, id, index: index - 1, title }));

    const minTocDepth = Math.min(...headingsWithoutDepth1Heading.map(({ depth: number }) => number));

    throwIfNotValidToc(parsedHeadings);

    // const getImmediateChildren = getImmediateTocNodeChildrenFactory(headingsWithoutDepth1Heading);
    // const tocNodeHasChildren = tocNodeHasChildrenFactory(headingsWithoutDepth1Heading);

    // const minDepth = Math.min(...headingsWithoutDepth1Heading.map(({ depth }) => depth));
    // const minDepthSiblingGroup = headingsWithoutDepth1Heading.filter(({ depth }) => minDepth === depth);

    // if (collapse) {
    //     return (function recurse(tocNodeSiblingsGroup: parsedHeadingWithIndex[]): string {
    //         return tagUnindent`
    //             <ul>
    //                 ${[
    //                     tocNodeSiblingsGroup
    //                         .map(({ index }) => {
    //                             const { id, title } = headingsWithoutDepth1Heading[index];
    //                             if (tocNodeHasChildren(index)) {
    //                                 return tagUnindent`
    //                                     <li>
    //                                     <details margin=0>
    //                                     <summary><a href="#${id}">${title}</a></summary>
    //                                     ${[recurse(getImmediateChildren(index))]}
    //                                     </details>
    //                                     </li>
    //                                 `;
    //                             }
    //                             return tagUnindent`
    //                                 <li>
    //                                     <a href="#${id}">${title}</a>
    //                                 </li>
    //                             `;
    //                         })
    //                         .join("\n"),
    //                 ]}
    //             </ul>
    //         `;
    //     })(minDepthSiblingGroup);
    // }
    // if (!collapse) {
    return headingsWithoutDepth1Heading
        .map(({ title, depth, id }) => {
            return `${indent}${tocSpacing.repeat(depth - minTocDepth)}- [${title}](#${id})`;
        })
        .join("\n");
    // }

    // throw Error(internalErrorMessages.internalLibraryError);
}
