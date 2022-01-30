export declare type EntityGeneratorSchema<T> = {
    kind: "entity";
    name: string;
    attributes: Record<string, GeneratorSchema<T>>;
};
export declare type TableGeneratorSchema<T> = {
    kind: "table";
    name: string;
    table: (T | GeneratorSchema<T>)[];
};
export declare type GeneratorSchema<T> = EntityGeneratorSchema<T> | TableGeneratorSchema<T>;
export declare function createEntitySchema<T>(name: string, attributes: Record<string, GeneratorSchema<T>>): {
    kind: string;
    name: string;
    attributes: Record<string, GeneratorSchema<T>>;
};
export declare function createTableSchema<T>(name: string, table: (T | GeneratorSchema<T>)[]): {
    kind: string;
    name: string;
    table: (T | GeneratorSchema<T>)[];
};
