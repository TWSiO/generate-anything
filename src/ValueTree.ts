import { GeneratorRepr, TableGeneratorRepr, EntityGeneratorRepr } from "./GeneratorRepr";
import { Seed } from "./util";
import * as _ from "lodash/fp";
import seedrandom from "seed-random";

export const root: unique symbol = Symbol();

export type Unevaluated = {
    kind: "unevaluated"
    seed: Seed;
};

export abstract class Node<T> {
    readonly parent: (typeof root) | Node<T>;
    readonly seed: Seed;

    constructor(parent: (typeof root) | Node<T>, seed: Seed) {
        this.parent = parent;
        this.seed = seed;
    }
}

function generate<T>(seed: Seed, parent: (typeof root) | Node<T>, gen: GeneratorRepr<T>): Value<T> {
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
    readonly generator: TableGeneratorRepr<T>;
    private value: Unevaluated | Value<T>;

    constructor(parent: (typeof root) | Node<T>, generator: TableGeneratorRepr<T>, seed: Seed) {
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
            switch(result.kind) {
                case "entity":
                    this.value = new Entity(
                        this,
                        result,
                        String(rng()),
                    );
                    break;
                case "table":
                    this.value = new Table(
                        this,
                        result,
                        String(rng()),
                    );
                    break;
            }
        } else {
            this.value = new Scalar(result);
        }

        return this.value;
    }

    static newRoot<T>(seed: Seed, gen: TableGeneratorRepr<T>): Table<T> {
        return new this(root, gen, seed);
    }
}

export class Entity<T> extends Node<T> {
    readonly kind: "entity" = "entity";
    readonly generator: EntityGeneratorRepr<T>;
    private value: { [K in string]: Unevaluated | Value<T> };

    constructor(parent: (typeof root) | Node<T>, generator: EntityGeneratorRepr<T>, seed: Seed) {
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

    static newRoot<T>(seed: Seed, gen: EntityGeneratorRepr<T>): Entity<T> {
        return new this(root, gen, seed);
    }
}

export type Value<T> = Scalar<T> | Table<T> | Entity<T>;

export function newRoot<T>(seed: Seed, generator: GeneratorRepr<T>): Node<T> {
    switch (generator.kind) {
        case "entity":
            return new Entity(root, generator, seed);

        case "table":
            return new Table(root, generator, seed);
    }

    throw new Error("Node value still unevaluated after generate");
}
