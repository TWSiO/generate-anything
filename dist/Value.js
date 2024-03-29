"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRoot = exports.Entity = exports.Table = exports.Scalar = exports.Node = exports.root = void 0;
const seed_random_1 = __importDefault(require("seed-random"));
exports.root = Symbol("root");
/**
 * For types of generators that can be considered part of a "tree" with a "parent" generating node.
 */
class Node {
    constructor(parent, seed) {
        this.parent = parent;
        this.seed = seed;
    }
}
exports.Node = Node;
function generate(seed, parent, gen) {
    switch (gen.kind) {
        case "table":
            return new Table(parent, gen, seed);
        case "entity":
            return new Entity(parent, gen, seed);
    }
    throw new Error("Node value still unevaluated after generate");
}
class Scalar {
    constructor(value) {
        this.kind = "scalar";
        this.leaf = value;
    }
}
exports.Scalar = Scalar;
class Table extends Node {
    constructor(parent, generator, seed) {
        super(parent, seed);
        this.kind = "table";
        this.generator = generator;
        this.value = {
            kind: "unevaluated",
            seed: String((0, seed_random_1.default)(this.seed)()),
        };
    }
    get() {
        if (this.value.kind !== "unevaluated") {
            return this.value;
        }
        const rng = (0, seed_random_1.default)(this.seed);
        const repr = this.generator;
        const result = repr.table[Math.floor(rng() * repr.table.length)];
        if (typeof result === "object" && "kind" in result) {
            this.value = generate(String(rng()), this, result);
        }
        else {
            this.value = new Scalar(result);
        }
        return this.value;
    }
}
exports.Table = Table;
class Entity extends Node {
    constructor(parent, generator, seed) {
        super(parent, seed);
        this.kind = "entity";
        this.generator = generator;
        const rng = (0, seed_random_1.default)(seed);
        const accumulator = (accum, val) => {
            accum[val] = {
                kind: "unevaluated",
                seed: String(rng()),
            };
            return accum;
        };
        const keys = Object.keys(generator.attributes);
        // Ensuring consistant and reproducable order of generated seeds.
        keys.sort((left, right) => ("" + left).localeCompare(right));
        this.value = keys.reduce(accumulator, {});
    }
    get(key) {
        if (!(key in this.generator.attributes)) {
            throw new Error("Key not in entity");
        }
        const possibleValue = this.value[key];
        if (possibleValue.kind !== "unevaluated") {
            return possibleValue;
        }
        const repr = this.generator.attributes[key];
        return generate(possibleValue.seed, this, repr);
    }
    getAll() {
        const all = {};
        for (const n in this.generator.attributes) {
            all[n] = this.get(n);
        }
        return all;
    }
}
exports.Entity = Entity;
function newRoot(seed, gen) {
    return generate(seed, exports.root, gen);
}
exports.newRoot = newRoot;
