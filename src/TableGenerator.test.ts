import { TableGenerator } from "./TableGenerator";

test("Smoke", () => {
    const testGenerator = new TableGenerator(["a", "b", "c"]);

    console.log(testGenerator.generate("1"));
});
