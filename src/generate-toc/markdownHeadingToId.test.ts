import { markdownHeadingToId } from "./markdownHeadingToId";

describe(markdownHeadingToId.name, () => {
    it("converts markdown heading to id", () => {
        expect(markdownHeadingToId("3.0.0")).toBe("300");
        expect(markdownHeadingToId("3.0.0")).toBe("300-1");
        expect(markdownHeadingToId("3.0.0-1")).toBe("300-1-1");
        expect(markdownHeadingToId("3.0.0-1")).toBe("300-1-2");
        expect(markdownHeadingToId("3.0.0")).toBe("300-2");
        expect(markdownHeadingToId("3.0.0-1-2")).toBe("300-1-2-1");
        expect(markdownHeadingToId("hello_world")).toBe("hello_world");
        expect(markdownHeadingToId("I♥U")).toBe("iu");
    });
});
