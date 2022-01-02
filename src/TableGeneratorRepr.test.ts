import { TableGenerator } from "./TableGenerator";

test("Smoke", () => {
    /*
    const testGenerator = new TableGenerator("Test", "1", ["a", "b", "c"]);

    expect(testGenerator.generate()).toBe("a");
    */
});

test("Reproducing generated values", () => {
    /*
    const table = [2, 3, 5, 7, 11, 13, 17, 19]
    const seed = "Lorem ipsum";

    const testGeneratorOne = new TableGenerator("Table One", seed, table);
    const testGeneratorTwo = new TableGenerator("Table Two", seed, table);

    expect(testGeneratorOne.generate()).toBe(testGeneratorTwo.generate());
    */
});
