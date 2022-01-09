import { GeneratorRepr, TableGeneratorRepr, EntityGeneratorRepr } from "./GeneratorRepr";
import { Node, Value, Table, Entity, Scalar, Unevaluated, unevaluated } from "./ValueTree";
import { Seed } from "./util";
import seedrandom from "seed-random";
import * as _ from "lodash/fp";

export function generate<T>(uneval: Unevaluated<T>): void {
    switch (value.kind) {
        case "table":
            tableGenerator(value);

            break;

        case "entity":
            entityGenerator(value);
            break;

        default:
            console.log("Generated non-generator");
            break;
    }
}

export function generateLevels<T>(num: number, node: Value<T>): void {

    generate(node);

    //const ungeneratedNext: Node<T> = generatedNode.value;

    const isUnevaluated = (n: Unevaluated | Value<T>) => n.kind === "unevaluated";
    const filterEvaluated = _.flip(_.filter)(isUnevaluated);
    //const generateAll: ((n: Node<T>[]) => void) = _.flip(_.forEach)(generate);
    const generateAll: ((ns: Value<T>[]) => void) = (ns) => ns.forEach(n => generateLevels(num - 1, n));
    const generateUngenerated = _.compose([ generateAll, filterEvaluated ]);

    if ((num - 1) == 0 || node.kind === "scalar") {
        return;
    }
    /* else if (typeof node.value === "object" && entitySymbol in node.value) {
        const ev: EntityValue<T> = node.value;

        generateUngenerated(ev.keys().map(k => node.value[k]));
        } else if (isUnevaluated(node)) {
        generate(node);
        }
        */

    switch (node.value.kind) {
        case "unevaluated":
            throw new Error("Node value still unevaluated after generate");
        break;
        case "scalar":
            break;
        case "table":
            console.log("Generating node.");
            generateLevels(num - 1, node.value);
        break;
        case "entity":
            console.log("Generating entity.");
            const v = node.value.value;

            if (v.kind === "unevaluated") {
                throw new Error("Entity value still unevaluated after generate");
            }

            const keys = Object.keys(v.value);
            const vals = keys.map(k => v.value[k])
            // Ensures consistant order of generation.
            vals.sort((left, right) => ("" + left.seed).localeCompare(right.seed));
            /*
            console.log(vals);
            console.log(vals.map(isUnevaluated));
            generateUngenerated(vals);
            */
           generateAll(vals);
        break;
    }

    /*
    // This should be checking generatedValue, not ungeneratedNext. Although type system might still complain so might have to check actual value's type.
    //
    if (
    switch(generatedNode.generator.kind) {
        case "table":
            return generateLevels(number - 1, ungeneratedNext);
        case "entity":
            generatedNode.value.keys().forEach(
                k => generateLevels(number - 1, generatedNode.value[k])
    }
    */
}

function tableGenerator<T>(table: Table<T>): void {
    const rng = seedrandom(table.seed);
    const repr = table.generator;

    const result = repr.table[Math.floor(rng() * repr.table.length)];

    if (typeof result === "object" && "kind" in result) {
        switch(result.kind) {
            case "entity":
                table.value = new Entity(
                    table,
                    result,
                    String(rng()),
                );
                break;
            case "table":
                table.value = new Table(
                    table,
                    result,
                    String(rng()),
                );
                break;
        }
    } else {
        table.value = new Scalar(result);
    }
}

function entityGenerator<T>(entity: Entity<T>): void {
    entity.value = {};
    const attributes = entity.generator.attributes;
    const rng = seedrandom(entity.seed);

    for (const attribute in attributes) {
        const gen = attributes[attribute];
        switch(gen.kind) {
            case "entity":
                entity.value[attribute] = new Entity(
                    entity,
                    gen,
                    String(rng()),
                );
                break;
            case "table":
                entity.value[attribute] = new Table(
                    entity,
                    gen,
                    String(rng()),
                );
                break;
        }
    }
}
