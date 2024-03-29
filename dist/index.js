"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableSchema = exports.createEntitySchema = exports.newRoot = exports.Entity = exports.Table = exports.Scalar = exports.root = void 0;
var Value_1 = require("./Value");
Object.defineProperty(exports, "root", { enumerable: true, get: function () { return Value_1.root; } });
Object.defineProperty(exports, "Scalar", { enumerable: true, get: function () { return Value_1.Scalar; } });
Object.defineProperty(exports, "Table", { enumerable: true, get: function () { return Value_1.Table; } });
Object.defineProperty(exports, "Entity", { enumerable: true, get: function () { return Value_1.Entity; } });
Object.defineProperty(exports, "newRoot", { enumerable: true, get: function () { return Value_1.newRoot; } });
var GeneratorSchema_1 = require("./GeneratorSchema");
Object.defineProperty(exports, "createEntitySchema", { enumerable: true, get: function () { return GeneratorSchema_1.createEntitySchema; } });
Object.defineProperty(exports, "createTableSchema", { enumerable: true, get: function () { return GeneratorSchema_1.createTableSchema; } });
