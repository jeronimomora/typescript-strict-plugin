"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosixFilePath = void 0;
const path_1 = __importDefault(require("path"));
function getPosixFilePath(filePath) {
    return filePath.split(path_1.default.sep).join(path_1.default.posix.sep);
}
exports.getPosixFilePath = getPosixFilePath;
