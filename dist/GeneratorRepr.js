"use strict";
// Maybe call these "Generator Components"
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTable = exports.createEntity = void 0;
function createEntity(name, attributes) {
    return {
        kind: "entity",
        name: name,
        attributes: attributes,
    };
}
exports.createEntity = createEntity;
function createTable(name, table) {
    return {
        kind: "table",
        name: name,
        table: table,
    };
}
exports.createTable = createTable;
