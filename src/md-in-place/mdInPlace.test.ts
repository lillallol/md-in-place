import * as fs from "fs";
import * as path from "path";
import { constants } from "../constants";

import { errorMessages } from "../errorMessages";
import { tagUnindent } from "../es-utils/index";
import { mdInPlace } from "./mdInPlace";

describe(mdInPlace.name, () => {
    it("throws error when provided with input file that can not be accessed", () => {
        const input: string = "./does-not-exist.md";
        expect(() => mdInPlace({ input })).toThrow(errorMessages.inputFileCanNotBeAccessed(input));
    });
    it("mutates the provided markdown file", () => {
        const pathToMd: string = "./1.mock.md";
        const absolutePathToMd: string = path.resolve(__dirname, pathToMd);

        const md = tagUnindent`
            # hello world

            ## a list

            -   a list
                -   another list
                    - the last list

                        <!--#region toc-->

                        <!--#endregion toc-->

        `;

        fs.writeFileSync(absolutePathToMd, md);

        mdInPlace({ input: absolutePathToMd });

        const mutatedMd = fs.readFileSync(absolutePathToMd, { encoding: "utf-8" });

        expect(mutatedMd).toBe(tagUnindent`
            # hello world

            ## a list

            -   a list
                -   another list
                    - the last list

                        <!--#region toc-->

                        ${constants.tocSpacing.repeat(2 - 2)}- [a list](#a-list)

                        <!--#endregion toc-->

        `);
    });
});
