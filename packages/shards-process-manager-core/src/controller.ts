import { registerMeteorMethod, registerMeteorPublication } from '@moxb/meteor';
import type { ProcessRecord } from './types';
import { ProcessCollection } from './collections';

export interface DefineProcessesParams {
    onlyIfMissing?: boolean;
    clean?: boolean;
}

export interface ProcessController {
    defineProcesses: (scopeId: string, params?: DefineProcessesParams) => void;
    launchProcess: (scopeId: string, processId: string) => void;
    stopProcess: (scopeId: string, processId: string) => void;
    dismissProcessMessages: (scopeId: string, processId: string) => void;
    verifyScopeAccess: (userId: string | null, scopeId: string, reason: string) => void;
}

let controller: ProcessController | undefined;
export function injectProcessController(newController: ProcessController) {
    controller = newController;
}

export const publicationBackgroundProcesses = registerMeteorPublication<
    { scopeId: string; search: string },
    ProcessRecord
>({
    name: 'background-process-list',
    collection: ProcessCollection,
    auth: ({ scopeId }, userId) => controller!.verifyScopeAccess(userId, scopeId, 'list processes'),
    prePublish: (args) => {
        controller!.defineProcesses(args.scopeId, { onlyIfMissing: true });
    },
    selector: (args) => {
        const { scopeId, search } = args;
        const selector: Mongo.Selector<ProcessRecord> = {
            scopeId,
        };
        if (search) {
            selector.name = { $regex: search, $options: 'im' };
        }
        return selector;
    },
    options: () => ({ sort: { detailLevel: 1 } }),
});

export const purgeProcesses = registerMeteorMethod({
    name: 'purgeProcesses',
    serverOnly: true,
    auth: (scopeId, userId) => controller!.verifyScopeAccess(userId, scopeId, 'purge processes'),
    execute: (scopeId: string) => controller!.defineProcesses(scopeId, { clean: true }),
});

export const launchProcessMethod = registerMeteorMethod<{ scopeId: string; processId: string }, void>({
    name: 'launchProcess',
    serverOnly: true,
    unblock: true,
    auth: ({ scopeId }, userId) => controller!.verifyScopeAccess(userId, scopeId, 'launch process'),
    execute: ({ scopeId, processId }) => controller!.launchProcess(scopeId, processId),
});

export const stopProcessMethod = registerMeteorMethod<{ scopeId: string; processId: string }, void>({
    name: 'stopProcess',
    serverOnly: true,
    auth: ({ scopeId }, userId) => controller!.verifyScopeAccess(userId, scopeId, 'stop process'),
    execute: ({ scopeId, processId }) => controller!.stopProcess(scopeId, processId),
});

export const dismissProcessMessagesMethod = registerMeteorMethod<{ scopeId: string; processId: string }, void>({
    name: 'dismissProcessMessages',
    serverOnly: true,
    auth: ({ scopeId }, userId) => controller!.verifyScopeAccess(userId, scopeId, 'dismiss message'),
    execute: ({ scopeId, processId }) => controller!.dismissProcessMessages(scopeId, processId),
});
