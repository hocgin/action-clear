import {run} from "./core";
import * as core from "@actions/core";

export interface Inputs {
    debug?: boolean;
    limit_tags: number;
    limit_release: number;
    limit_failure_workflow_run: number;
}

export interface Outputs {
    // ..
    [key: string]: any
}

let getInput = (): Inputs => ({
    debug: core.getInput('debug') === 'true',
    limit_tags: parseInt(core.getInput('limit_tags', {required: true}) ?? '-1'),
    limit_release: parseInt(core.getInput('limit_release', {required: true}) ?? '-1'),
    limit_failure_workflow_run: parseInt(core.getInput('limit_failure_workflow_run', {required: true}) ?? '-1'),
})

let handleOutput = (output: Outputs = {}) => {
    Object.keys(output).forEach((key) => core.setOutput(key, output[key]));
    debugPrintf('输出变量: ', output);
};

export function debugPrintf(...args: any) {
    if (getInput().debug) {
        console.log(...args);
    }
}

try {
    run(getInput()).then(handleOutput)
} catch (error: any) {
    core.setFailed(error?.message);
}

