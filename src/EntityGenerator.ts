import { Generator } from "./Generator";
import { AbstractGenerator } from "./AbstractGenerator";
import { Seed } from "./util";
import seedrandom from "seed-random";

export class EntityGenerator extends AbstractGenerator implements Generator {
    readonly name: string;
    private seed: Seed;
    generators: Record<string, Generator>;

    constructor(name: string, seed: Seed, generators: Record<string, Generator>) {
        super();
        this.name = name;
        this.seed = seed;
        this.generators = generators;
    }

    generateUncached(): Record<string, any> {
        if (this.generatedValue === null) {
            const rng = seedrandom(this.seed);
            let generatedEntity: Record<string, any> = {};
            for (const name in this.generators) {
                generatedEntity[name] = this.generators[name].generate();
            }

            this.generatedValue = generatedEntity;
        }

        return this.generatedValue;
    }
}
