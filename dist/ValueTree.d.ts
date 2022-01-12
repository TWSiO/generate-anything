import { GeneratorRepr, TableGeneratorRepr, EntityGeneratorRepr } from "./GeneratorRepr";
import { Seed } from "./util";
export declare const root: unique symbol;
export declare type Unevaluated = {
    kind: "unevaluated";
    seed: Seed;
};
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
    readonly generator: TableGeneratorRepr<T>;
    private value;
    constructor(parent: (typeof root) | Node<T>, generator: TableGeneratorRepr<T>, seed: Seed);
    get(): Value<T>;
    static newRoot<T>(seed: Seed, gen: TableGeneratorRepr<T>): Table<T>;
}
export declare class Entity<T> extends Node<T> {
    readonly kind: "entity";
    readonly generator: EntityGeneratorRepr<T>;
    private value;
    constructor(parent: (typeof root) | Node<T>, generator: EntityGeneratorRepr<T>, seed: Seed);
    get(key: string): Value<T>;
    static newRoot<T>(seed: Seed, gen: EntityGeneratorRepr<T>): Entity<T>;
}
export declare type Value<T> = Scalar<T> | Table<T> | Entity<T>;
export declare function newRoot<T>(seed: Seed, generator: GeneratorRepr<T>): Node<T>;
