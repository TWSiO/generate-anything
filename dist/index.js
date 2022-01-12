"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneerateRepr = exports.newRoot = exports.Entity = exports.Table = exports.Scalar = exports.root = exports.util = void 0;
exports.util = __importStar(require("./util"));
var ValueTree_1 = require("./ValueTree");
Object.defineProperty(exports, "root", { enumerable: true, get: function () { return ValueTree_1.root; } });
Object.defineProperty(exports, "Scalar", { enumerable: true, get: function () { return ValueTree_1.Scalar; } });
Object.defineProperty(exports, "Table", { enumerable: true, get: function () { return ValueTree_1.Table; } });
Object.defineProperty(exports, "Entity", { enumerable: true, get: function () { return ValueTree_1.Entity; } });
Object.defineProperty(exports, "newRoot", { enumerable: true, get: function () { return ValueTree_1.newRoot; } });
exports.GeneerateRepr = __importStar(require("./GeneratorRepr"));
