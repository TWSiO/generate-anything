import { generate, generateLevels } from "./Generator";
import { Node, root, unevaluated, newRoot, Table, Value, Entity } from "./ValueTree";
import { GeneratorRepr, createEntity, createTable, TableGeneratorRepr } from "./GeneratorRepr";
import seedrandom from "seed-random";

function expectScalar<T>(val: Value<T>, expected: T): T {
    switch (val.kind) {
        case "scalar":
            expect(val.leaf).toBe(expected);
            break;
        default:
            expect(true).toBe(false);
    }

    return val.leaf;
}

test("Smoke", () => {
    const table: TableGeneratorRepr<string> = createTable("Test table",
        [
            "a",
            "b",
            "c",
        ]
    );

    const rt = Table.newRoot("smoke", table);

    switch (rt.get().kind) {
        case "scalar":
            expect(rt.get().leaf).toBe("a");
            break;
        default:
            expect(true).toBe(false);
    }
});

test("Small", () => {
    const color = createTable<string>(
        "Color",
        ["red", "blue", "green"]
    );
    
    const food = createTable(
        "Food",
        ["apple", "banana", "carrot"]
    );

    const person = createEntity(
        "Person",
        {
            "Favorite color": color,
            "Favorite food": food,
        }
    );

    const rt = Entity.newRoot("1", person);

    /*
    for (const attr in Object.keys(rt.generator.attributes)) {
        rt.get(attr);
    }
    */

   expect(rt.get("Favorite color").kind).toBe("table");
    expectScalar(rt.get("Favorite color").get(), "red");
   expect(rt.get("Favorite food").kind).toBe("table");
    expectScalar(rt.get("Favorite food").get(), "banana");
});

const tool = createTable<string>(
    "Tool",
    ["wrench", "hammer", "screwdriver"]
);
const musicalInstrument = createTable<string>(
    "Musical instrument",
    ["guitar", "trumpet", "drum"]
);

const equipment = createTable<string>(
    "Equipment",
    [tool, musicalInstrument]
);

const food = createTable(
    "Food",
    ["apple", "banana", "carrot"]
);

const person = createEntity(
    "Person",
    {
        "Starting equipment": equipment,
        "Favorite food": food,
    }
);

const personRoot = newRoot("1", person)

test.each([[personRoot, null]])("generateLevels 1", (p, expected) => {
;
    expectScalar(p.get("Starting equipment").get().get(), "drum");

    //console.log(p);


    /*
    console.log(p);
    console.log(p.value.value["Staping equipment"]);
    console.log(p.value.value["Favorite food"]);

    console.log(Object.keys(p.value.value));
    */
});

// test.each([personRoot, null])("generateLevels 2", (p, expected) => {
    //console.log(p);
//     expect("Starting equipment" in p.value.value).toBe(true);
//     expect(p.value.value["Starting equipment"].value).toBe(unevaluated);
// 
//     generateLevels(2, p);
// 
//     //expect(p.value.value["Starting equipment"].value.name).toBe("Musical instrument);
//     //expect(p.value.value["Favorite food"].value.value).toBe("banana");
//     /*
//     console.log(p.value.value["Starting equipment"]);
//     console.log(p.value.value["Favorite food"]);
//     */
// 
//     expect(p.value.value["Favorite food"].value).not.toBe(unevaluated);
//     expect(p.value.value["Favorite food"].value.value).toBe("banana");
// });
// 
// test.each([personRoot, null])("generateLevels 3", (p, expected) => {
//     expect(p.value.value["Starting equipment"].value.value).toBe(unevaluated);
// 
//     generateLevels(3, p);
// 
//     expect(p.value.value["Starting equipment"].value.value).not.toBe(unevaluated);
//     //console.log(p.value.value["Starting equipment"].value.value);
// });
    // */
