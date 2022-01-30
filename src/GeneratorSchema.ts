export type EntityGeneratorSchema<T> = {
    kind: "entity";
    name: string;
    attributes: Record<string, GeneratorSchema<T>>;
}

// Only thing that currently is random.
export type TableGeneratorSchema<T> = {
    kind: "table";
    name: string;
    table: (T | GeneratorSchema<T>)[];
}

export type GeneratorSchema<T> = EntityGeneratorSchema<T> | TableGeneratorSchema<T>;

export function createEntitySchema<T>(name: string, attributes: Record<string, GeneratorSchema<T>>) {
    return {
        kind: "entity",
        name: name,
        attributes: attributes,
    }
}

export function createTableSchema<T>(name: string, table: (T | GeneratorSchema<T>)[]) {
    return {
        kind: "table",
        name: name,
        table: table,
    }
}
