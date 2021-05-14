import { headingToId } from "./headingToId";

describe(headingToId.name, () => {
    it("converts markdown heading to id", () => {
        expect(headingToId({ textContent: "3.0.0" })).toBe("300");
        expect(headingToId({ textContent: "3.0.0" })).toBe("300-1");
        expect(headingToId({ textContent: "3.0.0-1" })).toBe("300-1-1");
        expect(headingToId({ textContent: "3.0.0-1" })).toBe("300-1-2");
        expect(headingToId({ textContent: "3.0.0" })).toBe("300-2");
        expect(headingToId({ textContent: "3.0.0-1-2" })).toBe("300-1-2-1");
        expect(headingToId({ textContent: "hello_world" })).toBe("hello_world");
        expect(headingToId({ textContent: "I♥U" })).toBe("iu");
        expect(headingToId({ textContent: "inject/generation" })).toBe("injectgeneration");
        expect(headingToId({ textContent: "hello " })).toBe("hello-");
        expect(headingToId({ textContent: "   a    lot     of   spaces     heading   " })).toBe(
            "---a----lot-----of---spaces-----heading---"
        );
    });
});
