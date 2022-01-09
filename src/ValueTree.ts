import { GeneratorRepr, TableGeneratorRepr, EntityGeneratorRepr } from "./GeneratorRepr";
import { Seed } from "./util";
import * as _ from "lodash/fp";


export const root: unique symbol = Symbol();

/*
export type Unevaluated = {
    kind: "unevaluated"
};

export const unevaluated: Unevaluated = { kind: "unevaluated" };
*/

// Probably change to an interface and others to classes.
export abstract class Node<T> {
    //evaluated: boolean;
    readonly parent: (typeof root) | Node<T>;
    readonly seed: Seed;

    constructor(parent: (typeof root) | Node<T>, seed: Seed) {
        this.parent = parent;
        this.seed = seed;
    }
}

export class Unevaluated<T> extends Node<T> {
    /*
    readonly parent: (typeof root) | Node<T>;
    readonly generator: GeneratorRepr<T>;
    readonly seed: Seed;

    constructor(parent: (typeof root) | Node<T>, generator: TableGeneratorRepr<T>, seed: Seed) {
        this.parent = parent;
        this.generator = generator;
        this.seed = seed;
    }

   readonly generator: GeneratorRepr<T>;

    constructor(parent: (typeof root) | Node<T>, generator: TableGeneratorRepr<T>, seed: Seed) {
        super(parent, seed);

        this.generator = generator;
    }
    */
}

export class Scalar<T> {
    //evaluated: boolean = true;
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
        this.value = new Unevaluated(parent, generator, seed);
    }

    function get(): Value<T> {
    }
}

export class Entity<T> extends Node<T> {
    readonly kind: "entity" = "entity";
    readonly generator: EntityGeneratorRepr<T>;
    value: { [K in string]: Unevaluated | Value<T> };

    constructor(parent: (typeof root) | Node<T>, generator: EntityGeneratorRepr<T>, seed: Seed) {
        super(parent, seed);
        this.generator = generator;

        this.value = new Unevaluated(parent, generator, seed);
    /*
        this.super(parent, generator, seed);

        const accumulator = (accum, val) => {
            accum[val] = unevaluated;
            return accum;
        };

        this.value = Object.keys(generator.attributes).reduce(accumulator, {});
    */
    }

    function get(key: string): Value<T> {
    }
}

export type Value<T> = Scalar<T> | Table<T> | Entity<T>;

export function newRoot<T>(seed: Seed, generator: GeneratorRepr<T>) {
    switch (generator.kind) {
        case "entity":
            return new Entity(root, generator, seed);

        case "table":
            return new Table(root, generator, seed);
    }

    throw new Error("Node value still unevaluated after generate");
}
