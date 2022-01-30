import { Node, root, unevaluated, newRoot, Table, Value, Entity } from "./Value";
import { GeneratorSchema, createEntitySchema, createTableSchema, TableGeneratorSchema } from "./GeneratorSchema";
import seedrandom from "seed-random";
import * as _ from "lodash/fp";

// TODO make more extensive tests.

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
    const table: TableGeneratorSchema<string> = createTableSchema("Test table",
        [
            "a",
            "b",
            "c",
        ]
    );

    const rt = newRoot("smoke", table);

    switch (rt.get().kind) {
        case "scalar":
            expect(rt.get().leaf).toBe("a");
            break;
        default:
            expect(true).toBe(false);
    }
});

test("Small", () => {
    const color = createTableSchema<string>(
        "Color",
        ["red", "blue", "green"]
    );
    
    const food = createTableSchema(
        "Food",
        ["apple", "banana", "carrot"]
    );

    const person = createEntitySchema(
        "Person",
        {
            "Favorite color": color,
            "Favorite food": food,
        }
    );

    const rt = newRoot("1", person);

   expect(rt.get("Favorite color").kind).toBe("table");
    expectScalar(rt.get("Favorite color").get(), "red");
   expect(rt.get("Favorite food").kind).toBe("table");
    expectScalar(rt.get("Favorite food").get(), "banana");
});

const tool = createTableSchema<string>(
    "Tool",
    ["wrench", "hammer", "screwdriver"]
);
const musicalInstrument = createTableSchema<string>(
    "Musical instrument",
    ["guitar", "trumpet", "drum"]
);

const equipment = createTableSchema<string>(
    "Equipment",
    [tool, musicalInstrument]
);

const food = createTableSchema(
    "Food",
    ["apple", "banana", "carrot"]
);

const person = createEntitySchema(
    "Person",
    {
        "Starting equipment": equipment,
        "Favorite food": food,
    }
);

const personRoot = newRoot("1", person)

test.each([[personRoot, null]])("generateLevels 1", (p, expected) => {
    expectScalar(p.get("Starting equipment").get().get(), "drum");

});
