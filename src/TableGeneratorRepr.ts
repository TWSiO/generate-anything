import { GeneratorRepr } from "./GeneratorRepr";

export interface TableGeneratorRepr<T> extends GeneratorRepr<T> {
    table: T[]
}
