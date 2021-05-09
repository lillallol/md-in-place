import * as fs from "fs";
import * as path from "path";

import { generateMd } from "../generate-md/generateMd/generateMd";

const pathToOutput: string = "./README.after.md";
const absolutePathToOutput: string = path.resolve(__dirname, pathToOutput);

const pathToInput: string = "./README.before.md";
const absolutePathToInput: string = path.resolve(__dirname, pathToInput);
const inputMd: string = fs.readFileSync(absolutePathToInput, { encoding: "utf-8" });

const outputMd: string = generateMd({ md: inputMd, pathToFolderContainingMd: __dirname });

fs.writeFileSync(absolutePathToOutput, outputMd);
