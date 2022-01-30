// Maybe call these "Generator Components"

export type EntityGeneratorRepr<T> = {
    kind: "entity";
    name: string;
    attributes: Record<string, GeneratorRepr<T>>;
}

// Only thing that currently is random.
export type TableGeneratorRepr<T> = {
    kind: "table";
    name: string;
    table: (T | GeneratorRepr<T>)[];
}

export type GeneratorRepr<T> = EntityGeneratorRepr<T> | TableGeneratorRepr<T>;

export function createEntity<T>(name: string, attributes: Record<string, GeneratorRepr<T>>) {
    return {
        kind: "entity",
        name: name,
        attributes: attributes,
    }
}

export function createTable<T>(name: string, table: (T | GeneratorRepr<T>)[]) {
    return {
        kind: "table",
        name: name,
        table: table,
    }
}
