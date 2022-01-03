
// We don't have to evaluate them all at once, but it would feel weird to partially evaluate an entity. Although, if that entity holds other entities, those would be evaluated and it would keep going eagerly.
// Maybe on the UI side, just have a button which evaluates all of the attributes, but don't do it automatically? Can still evaluate each attribute individually.
export type Entity<T> = {
    kind: "entity";
    attributes: Record<string, GeneratorRepr<T>>;
    name: string;
}

// Only thing that currently is random.
export type Table<T> = {
    kind: "table";
    table: (T | GeneratorRepr<T>)[];
    name: string;
}

// TODO for convenience, may want this to be a tagged union. Or use a type guard.
//export type GeneratorReprType<T> = Entity<T> | Table<T>;
export type GeneratorRepr<T> = Entity<T> | Table<T>;

/*
export type GeneratorRepr<T> = GeneratorReprType<T> & {
    name: string;
}
*/
