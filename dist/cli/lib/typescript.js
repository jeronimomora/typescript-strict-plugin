"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.showConfig = exports.listFilesOnly = void 0;
const execa_1 = __importDefault(require("execa"));
const listFilesOnly = async () => {
    const output = await execa_1.default('tsc', ['--listFilesOnly'], {
        all: true,
        preferLocal: true,
    });
    return output.stdout;
};
exports.listFilesOnly = listFilesOnly;
const showConfig = async () => {
    const output = await execa_1.default('tsc', ['--showConfig'], {
        all: true,
        preferLocal: true,
    });
    return output.stdout;
};
exports.showConfig = showConfig;
const compile = () => execa_1.default('tsc', ['--strict', '--noEmit', ...process.argv.slice(2)], {
    all: true,
    preferLocal: true,
});
exports.compile = compile;
