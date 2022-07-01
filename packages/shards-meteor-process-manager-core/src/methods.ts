import { registerMeteorMethod } from '@moxb/meteor';
import { getProcessController } from './controller';

/**
 * Re-define the processes
 */
export const purgeProcesses = registerMeteorMethod({
    name: 'purgeProcesses',
    serverOnly: true,
    auth: (scopeId, userId) => getProcessController().verifyScopeAccess(userId, scopeId, 'purge processes'),
    execute: (scopeId: string) => getProcessController().defineProcesses(scopeId, { clean: true }),
});

/**
 * Launch a process
 */
export const launchProcessMethod = registerMeteorMethod<{ scopeId: string; processId: string }, void>({
    name: 'launchProcess',
    serverOnly: true,
    unblock: true,
    auth: ({ scopeId }, userId) => getProcessController().verifyScopeAccess(userId, scopeId, 'launch process'),
    execute: ({ scopeId, processId }) => getProcessController().launchProcess(scopeId, processId),
});

/**
 * Stop a process
 */
export const stopProcessMethod = registerMeteorMethod<{ scopeId: string; processId: string }, void>({
    name: 'stopProcess',
    serverOnly: true,
    auth: ({ scopeId }, userId) => getProcessController().verifyScopeAccess(userId, scopeId, 'stop process'),
    execute: ({ scopeId, processId }) => getProcessController().stopProcess(scopeId, processId),
});

/**
 * Dismiss all process messages
 */
export const dismissProcessMessagesMethod = registerMeteorMethod<{ scopeId: string; processId: string }, void>({
    name: 'dismissProcessMessages',
    serverOnly: true,
    auth: ({ scopeId }, userId) => getProcessController().verifyScopeAccess(userId, scopeId, 'dismiss message'),
    execute: ({ scopeId, processId }) => getProcessController().dismissProcessMessages(scopeId, processId),
});
