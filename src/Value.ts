import { GeneratorSchema, TableGeneratorSchema, EntityGeneratorSchema } from "./GeneratorSchema";
import { Seed } from "./util";
import * as _ from "lodash/fp";
import seedrandom from "seed-random";

export const root: unique symbol = Symbol("root");

type Unevaluated = {
    kind: "unevaluated"
    seed: Seed;
};

/**
 * For types of generators that can be considered part of a "tree" with a "parent" generating node.
 */
export abstract class Node<T> {
    readonly parent: (typeof root) | Node<T>;
    readonly seed: Seed;

    constructor(parent: (typeof root) | Node<T>, seed: Seed) {
        this.parent = parent;
        this.seed = seed;
    }
}

function generate<T>(seed: Seed, parent: (typeof root) | Node<T>, gen: GeneratorSchema<T>): Value<T> {
    switch(gen.kind) {
        case "table":
            return new Table(
                parent,
                gen,
                seed,
            );
        case "entity":
            return new Entity(
                parent,
                gen,
                seed,
            );
    }

    throw new Error("Node value still unevaluated after generate");
}

export class Scalar<T> {
    readonly kind: "scalar" = "scalar";
    readonly leaf: T;

    constructor(value: T) {
        this.leaf = value;
    }
}

export class Table<T> extends Node<T> {
    readonly kind: "table" = "table";
    readonly generator: TableGeneratorSchema<T>;
    private value: Unevaluated | Value<T>;

    constructor(parent: (typeof root) | Node<T>, generator: TableGeneratorSchema<T>, seed: Seed) {
        super(parent, seed);
        this.generator = generator;
        this.value = {
            kind: "unevaluated",
            seed: String(seedrandom(this.seed)()),
        };
    }

    get(): Value<T> {
        if (this.value.kind !== "unevaluated") {
            return this.value;
        }

        const rng = seedrandom(this.seed);
        const repr = this.generator;

        const result = repr.table[Math.floor(rng() * repr.table.length)];

        if (typeof result === "object" && "kind" in result) {
            this.value = generate(String(rng()), this, result);
        } else {
            this.value = new Scalar(result);
        }

        return this.value;
    }
}

export class Entity<T> extends Node<T> {
    readonly kind: "entity" = "entity";
    readonly generator: EntityGeneratorSchema<T>;
    private value: { [K in string]: Unevaluated | Value<T> };

    constructor(parent: (typeof root) | Node<T>, generator: EntityGeneratorSchema<T>, seed: Seed) {
        super(parent, seed);
        this.generator = generator;
        const rng = seedrandom(seed);

        const accumulator = (accum: { [K in string]: Unevaluated }, val: string) => {
            accum[val] = {
                kind: "unevaluated",
                seed: String(rng()),
            };
            return accum;
        };

        const keys = Object.keys(generator.attributes);
        // Ensuring consistant and reproducable order of generated seeds.
        keys.sort((left, right) => ("" + left).localeCompare(right));
        this.value = keys.reduce(accumulator, {});
    }

    get(key: string): Value<T> {
        if (!(key in this.generator.attributes)) {
            throw new Error("Key not in entity");
        }

        const possibleValue = this.value[key];
        if (possibleValue.kind !== "unevaluated") {
            return possibleValue;
        }

        const repr = this.generator.attributes[key];

        return generate(possibleValue.seed, this, repr);
    }

    getAll(): { [K in string]: Value<T> } {
        let all: { [K in string]: Value<T> } = {};
        for (const n in this.generator.attributes) {
            all[n] = this.get(n);
        }

        return all;
    }
}

export type Value<T> = Scalar<T> | Table<T> | Entity<T>;

export function newRoot<T>(seed: Seed, gen: GeneratorSchema<T>) {
    return generate(seed, root, gen);
}
