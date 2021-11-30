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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const strictFiles_1 = require("../cli/lib/strictFiles");
const strictFilesUtils_1 = require("../cli/lib/strictFilesUtils");
const compile_1 = require("../cli/lib/compile");
const constants_1 = require("../common/constants");
const addTsStrictCommenToFile = (relativePath) => {
    const resolvedPath = path_1.default.resolve(relativePath);
    const data = fs.readFileSync(resolvedPath).toString().split('\n');
    data.unshift(`//${constants_1.TS_STRICT_COMMENT}`);
    const text = data.join('\n');
    fs.writeFileSync(resolvedPath, text);
};
const main = async () => {
    console.log('Getting files...');
    const files = await strictFiles_1.getFilesCheckedByTs();
    const allFiles = files
        .map((file) => path_1.default.relative('.', file))
        .filter((file) => !file.includes('..'))
        .filter((file) => file.includes('.ts') || file.includes('.tsx'));
    const filesWithTsStrictComment = strictFilesUtils_1.filterFilesWithStrictComment(allFiles);
    const filesWithoutTsStrictComment = allFiles.filter((file) => !filesWithTsStrictComment.includes(file));
    console.log('Compiling...');
    const errorsMap = await compile_1.compile();
    const relativeErrorsMap = new Map();
    for (const [key, value] of errorsMap.entries()) {
        relativeErrorsMap.set(path_1.default.relative('.', key), value);
    }
    // Let's try to automatically add //@ts-strict to the top of files without errors
    for (const fileWithoutTsComment of filesWithoutTsStrictComment) {
        // Skip files that had compilation errors
        if (relativeErrorsMap.has(fileWithoutTsComment)) {
            continue;
        }
        // Otherwise, add the comment
        addTsStrictCommenToFile(fileWithoutTsComment);
        console.log(`✅ - Added strict comment to ${chalk_1.default.bold(fileWithoutTsComment)}`);
    }
    console.log('Done.');
};
exports.main = main;
