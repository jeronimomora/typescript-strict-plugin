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
exports.findStrictFiles = exports.getFilesCheckedByTs = void 0;
const utils_1 = require("../../common/utils");
const strictFilesUtils_1 = require("./strictFilesUtils");
const typescript = __importStar(require("./typescript"));
const filterOutNodeModulesFiles = (files) => files.filter((fileName) => !fileName.includes('/node_modules/'));
const getFilesCheckedByTs = async () => {
    const filesCheckedByTs = await typescript.listFilesOnly();
    const filePaths = filesCheckedByTs.split(/\r?\n/).map(utils_1.getPosixFilePath);
    return filterOutNodeModulesFiles(filePaths);
};
exports.getFilesCheckedByTs = getFilesCheckedByTs;
const findStrictFiles = async () => {
    const strictPaths = (await strictFilesUtils_1.getStrictFilePaths()).map(utils_1.getPosixFilePath);
    const filesCheckedByTS = await exports.getFilesCheckedByTs();
    const filesWithTsStrictComment = strictFilesUtils_1.filterFilesWithStrictComment(filesCheckedByTS);
    const filesOnStrictPath = filesCheckedByTS.filter((fileName) => {
        return strictPaths.some((strictPath) => strictFilesUtils_1.isFileOnStrictPath(fileName, strictPath));
    });
    return Array.from(new Set([...filesWithTsStrictComment, ...filesOnStrictPath]));
};
exports.findStrictFiles = findStrictFiles;
