"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableSchema = exports.createEntitySchema = void 0;
function createEntitySchema(name, attributes) {
    return {
        kind: "entity",
        name: name,
        attributes: attributes,
    };
}
exports.createEntitySchema = createEntitySchema;
function createTableSchema(name, table) {
    return {
        kind: "table",
        name: name,
        table: table,
    };
}
exports.createTableSchema = createTableSchema;
