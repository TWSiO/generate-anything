import { GeneratorRepr, Table, Entity } from "./GeneratorRepr";
import { Node, Value, EntityValue, unevaluated } from "./ValueTree";
import { Seed } from "./util";
import seedrandom from "seed-random";

// Have to worry about generator order if want things to be reproduceable.
// Pass in seed or RNG?
// Actually, this should just generate one level, don't recurse.
export function generate<T>(seed: Seed, node: Node<T>): Node<T> {
    if (node.value !== unevaluated) {
        return node;
    }

    let value: Value<T>;

    const gen: GeneratorRepr<T> = node.generator;

    switch (gen.kind) {
        case "table":
            node.value = tableGenerator(seed, node, gen);

            break;

        case "entity":
            node.value = entityGenerator(gen, node);
            break;
    }

    return node;
}

function tableGenerator<T>(seed: Seed, node: Node<T>, repr: Table<T>): Value<T> {
    const rng = seedrandom(seed);

    const result = repr.table[Math.floor(rng() * repr.table.length)];

    if ("kind" in result) {
        const gen: Node<T> = {
            parent: node,
            generator: result,
            value: unevaluated
        }

        return gen;
    } else {
        return result;
    }
}

function entityGenerator<T>(repr: Entity<T>, node: Node<T>): EntityValue<T> {
    let evaluatedEntity: EntityValue<T> = {};

    for (const attribute in repr.attributes) {
        evaluatedEntity[attribute] = {
            parent: node,
            generator: repr.attributes[attribute],
            value: unevaluated
        }
    }

    return evaluatedEntity;
}

// Create a convenience function which generates x children down. Don't let them do it infinitely though or else there could be an infinite iteration.
