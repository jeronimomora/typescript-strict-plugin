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
exports.compile = void 0;
const path_1 = require("path");
const typescript = __importStar(require("./typescript"));
/**
 * @param tscOutput
 * Converts
 * TscOutput [
   "fileA(10,15): error TS2532: Object is possibly 'undefined'.",
   "fileA(11,15): error TS2532: Object is possibly 'undefined'.",
   "fileB(14,15): error TS2532: Object is possibly 'undefined'.",
   "fileB(15,15): error TS2532: Object is possibly 'undefined'."
   ]
 to:
   Map(2) {
    '/Users/User/project/src/fileA.ts' => [
      "fileA(10,15): error TS2532: Object is possibly 'undefined'.",
      "fileA(11,15): error TS2532: Object is possibly 'undefined'."
    ],
    '/Users/User/project/src/fileB.ts' => [
      "fileB(14,15): error TS2532: Object is possibly 'undefined'.",
      "fileB(15,15): error TS2532: Object is possibly 'undefined'."
    ]
}
 */
const getPathToErrorsMap = (tscOutput) => {
    const result = new Map();
    tscOutput.forEach((error) => {
        const path = path_1.resolve(process.cwd(), error.split('(')[0]);
        if (!error.includes('.ts') && !error.includes('.tsx')) {
            return; // this is not a file, don't add to map
        }
        if (result.has(path)) {
            result.set(path, [...result.get(path), error]);
        }
        else {
            result.set(path, [error]);
        }
    });
    return result;
};
const compile = async () => {
    let tscOutput = [];
    try {
        await typescript.compile();
    }
    catch (error) {
        const { all } = error;
        tscOutput = all.split(/\r?\n/);
    }
    if (tscOutput.some((it) => it.startsWith('error'))) {
        console.log(`💥 Typescript did not compile due to some errors. Errors: `, tscOutput);
        process.exit(1);
    }
    return getPathToErrorsMap(tscOutput);
};
exports.compile = compile;
