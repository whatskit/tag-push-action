"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDestinationTags = void 0;
const sync_1 = require("csv-parse/sync");
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const source = core.getInput('src');
            const dockerConfigPath = core.getInput('docker-config-path') || '/home/runner/.docker/config.json';
            const destination = yield getDestinationTags();
            if (source === '') {
                core.setFailed('Source image not set');
                return;
            }
            if (destination.length === 0) {
                core.setFailed('Destination image not set');
                return;
            }
            yield exec.exec('docker', [
                'run',
                '--rm',
                '-i',
                '-v',
                `${dockerConfigPath}:/root/.docker/config.json`,
                '--network',
                'host',
                'akhilerm/repo-copy:latest',
                source,
                ...destination
            ]);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
// This function is a modified version from the script used in docker buildx actions
// Ref https://github.com/docker/build-push-action/blob/master/src/context.ts#L163
function getDestinationTags() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = [];
        const items = core.getInput('dst');
        if (items === '') {
            return res;
        }
        for (const output of (yield (0, sync_1.parse)(items, {
            columns: false,
            relaxColumnCount: true,
            skipRecordsWithEmptyValues: true
        }))) {
            if (output.length === 1) {
                res.push(output[0]);
            }
            else {
                res.push(...output);
            }
        }
        return res.filter(item => item).map(pat => pat.trim());
    });
}
exports.getDestinationTags = getDestinationTags;
run();
