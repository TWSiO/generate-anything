export declare type EntityGeneratorRepr<T> = {
    kind: "entity";
    name: string;
    attributes: Record<string, GeneratorRepr<T>>;
};
export declare type TableGeneratorRepr<T> = {
    kind: "table";
    name: string;
    table: (T | GeneratorRepr<T>)[];
};
export declare type GeneratorRepr<T> = EntityGeneratorRepr<T> | TableGeneratorRepr<T>;
export declare function createEntity<T>(name: string, attributes: Record<string, GeneratorRepr<T>>): {
    kind: string;
    name: string;
    attributes: Record<string, GeneratorRepr<T>>;
};
export declare function createTable<T>(name: string, table: (T | GeneratorRepr<T>)[]): {
    kind: string;
    name: string;
    table: (T | GeneratorRepr<T>)[];
};
