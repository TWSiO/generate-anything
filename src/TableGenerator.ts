import { Generator, ValueOrArray } from "./Generator";
import { Seed } from "./util";
import seedrandom from "seed-random";

export class TableGenerator<T> implements Generator<T> {
    values: T[];

    constructor(values: T[]) {
        this.values = values;
    }

    generate(seed: Seed): ValueOrArray<T> {
        const rng = seedrandom(seed);

        return this.values[Math.floor(rng() * this.values.length)];
    }
}
