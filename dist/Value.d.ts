import { GeneratorSchema, TableGeneratorSchema, EntityGeneratorSchema } from "./GeneratorSchema";
import { Seed } from "./util";
export declare const root: unique symbol;
/**
 * For types of generators that can be considered part of a "tree" with a "parent" generating node.
 */
export declare abstract class Node<T> {
    readonly parent: (typeof root) | Node<T>;
    readonly seed: Seed;
    constructor(parent: (typeof root) | Node<T>, seed: Seed);
}
export declare class Scalar<T> {
    readonly kind: "scalar";
    readonly leaf: T;
    constructor(value: T);
}
export declare class Table<T> extends Node<T> {
    readonly kind: "table";
    readonly generator: TableGeneratorSchema<T>;
    private value;
    constructor(parent: (typeof root) | Node<T>, generator: TableGeneratorSchema<T>, seed: Seed);
    get(): Value<T>;
}
export declare class Entity<T> extends Node<T> {
    readonly kind: "entity";
    readonly generator: EntityGeneratorSchema<T>;
    private value;
    constructor(parent: (typeof root) | Node<T>, generator: EntityGeneratorSchema<T>, seed: Seed);
    get(key: string): Value<T>;
    getAll(): Record<string, Value<T>>;
}
export declare type Value<T> = Scalar<T> | Table<T> | Entity<T>;
export declare function newRoot<T>(seed: Seed, gen: GeneratorSchema<T>): Value<T>;
