import * as fs from "fs";
import * as path from "path";

import { errorMessages } from "../errorMessages";
import { generateMd } from "../generate-md/generateMd/generateMd";
import { throwForLinksWithRelativePaths } from "../validate-links/throwForLinksWithRelativePaths";

/**
 * @description
 * Injects in place the provided github flavoured markdown, with file imports 
 * and auto generated toc.
 * @CLI
 */
export function mdInPlace(_: {
    /**
     * @description
     * Path to the markdown file.
     * @default "./README.md"
     * @flag i
     */
    input?: string;
}): void {
    let { input } = _;
    if (input === undefined) input = path.resolve("./README.md");
    const pathToFolderContainingInput = path.resolve(input, "../");

    try {
        fs.accessSync(input);
    } catch {
        throw Error(errorMessages.inputFileCanNotBeAccessed(input));
    }

    const mdFile: string = fs.readFileSync(input, { encoding: "utf-8" });

    const generatedMd: string = generateMd({
        md: mdFile,
        pathToFolderContainingMd: pathToFolderContainingInput,
    });

    throwForLinksWithRelativePaths(generatedMd);

    fs.writeFileSync(input, generatedMd);
}
