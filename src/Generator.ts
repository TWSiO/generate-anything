import { Seed } from "./util";

export interface Generator {
    readonly name: string;
    generate: () => any;
}
