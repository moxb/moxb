import { ProcessController } from './types';

let controller: ProcessController | undefined;

export function injectProcessController(newController: ProcessController) {
    controller = newController;
}

export function getProcessController(): ProcessController {
    if (!controller) {
        throw new Error('No process controller has been initialized.');
    }
    return controller;
}
