import { registerMeteorPublication } from '@moxb/meteor';
import type { ProcessRecord } from './types';
import { ProcessCollection } from './collections';
import { getProcessController } from './controller';

/**
 * This publication carries all process status info from the server to the client.
 */
export const publicationBackgroundProcesses = registerMeteorPublication<
    { scopeId: string; search: string },
    ProcessRecord
>({
    name: 'background-process-list',
    collection: ProcessCollection,
    auth: ({ scopeId }, userId) => getProcessController().verifyScopeAccess(userId, scopeId, 'list processes'),
    prePublish: (args) => {
        getProcessController().defineProcesses(args.scopeId, { onlyIfMissing: true });
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
