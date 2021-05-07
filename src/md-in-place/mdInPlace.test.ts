import { errorMessages } from "../errorMessages";
import { mdInPlace } from "./mdInPlace";

describe(mdInPlace.name, () => {
    it("throws error when provided with input file that can not be accessed", () => {
        const input: string = "./does-not-exist.md";
        expect(() => mdInPlace({ input })).toThrow(errorMessages.inputFileCanNotBeAccessed(input));
    });
});
