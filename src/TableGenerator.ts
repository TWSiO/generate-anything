import { Generator } from "./Generator";
import { Seed } from "./util";
import seedrandom from "seed-random";

// Create either a value or another generator
export class TableGenerator implements Generator {
    readonly name: string;
    private seed: Seed;
    values: any[];

    constructor(name: string, seed: Seed, values: any[]) {
        this.name = name;
        this.seed = seed;
        this.values = values;
    }

    generate(): any {
        const rng = seedrandom(this.seed);

        return this.values[Math.floor(rng() * this.values.length)];
    }
}
