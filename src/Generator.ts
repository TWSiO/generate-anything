import { Seed } from "./util";

export type ValueOrArray<T> = T | ValueOrArray<T>[];

export interface Generator<T> {
    generate: (seed: Seed) => ValueOrArray<T>;
}
