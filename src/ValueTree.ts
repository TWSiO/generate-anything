import { GeneratorRepr } from "./GeneratorRepr";

/**
 * Also need a root node. Special type?
 * Generate doesn't care what the parent is. Need current node to attach to resulting value, although maybe whatever calls it can do that.
 */

// Use within package, but don't export for use outside of package (maybe?).
export declare const unevaluated: unique symbol;

// Declaring type so we can assert unevaluated at type level.
// TODO I think I can unify the two node types and still check things at type level with structural typing stuff. Just have to figure out how.
export type Node<T> = {
    parent: Node<T>;
    generator: GeneratorRepr<T>;
    value: (typeof unevaluated) | Value<T>;
}

export type Value<T> = T | Node<T> | EntityValue<T>;

// Maybe combine with other entity.
export type EntityValue<T> = { [K in string]: Value<T> };
