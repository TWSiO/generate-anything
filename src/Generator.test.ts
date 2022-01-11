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

});

