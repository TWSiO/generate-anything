import { GeneratorRepr } from "./GeneratorRepr";

export interface EntityGeneratorRepr<T> extends GeneratorRepr<T> {
    attributes: Record<string, T | GeneratorRepr<T>>;
}
