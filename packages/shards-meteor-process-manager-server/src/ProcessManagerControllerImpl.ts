import { RequestCollection } from './collections';
import { injectProcessController, ProcessCollection } from '@moxb/shards-meteor-process-manager-core';
import type { DefineProcessesParams, ProcessController } from '@moxb/shards-meteor-process-manager-core';
import type { ProcessManagerControllerProps } from './controller';

export class ProcessManagerControllerImpl implements ProcessController {
    constructor(private readonly props: ProcessManagerControllerProps) {
        injectProcessController(this);
    }

    getProcess(scopeId: string, processId: string) {
        const dbEntry = ProcessCollection.findOne({ scopeId, processId });
        if (!dbEntry) {
            throw new Error(`Process "${processId}" (in scope ${scopeId}) not found!`);
        }
        return dbEntry;
    }

    /**
     * Verify that the current Meteor user has permission to access a given data scope
     */
    verifyScopeAccess(userId: string | null, scopeId: string, reason: string) {
        const { auth } = this.props;
        if (auth) {
            if (auth(userId, scopeId, reason)) {
                // console.log('Auth function says that access is OK');
            } else {
                throw new Meteor.Error(403, "You can't access this data scope!");
            }
        } else {
            // console.log('Process manager: no auth function is set, granting blanket permission...');
        }
    }

    defineProcesses(scopeId: string, params: DefineProcessesParams = {}) {
        RequestCollection.insert({
            type: 'defineProcesses',
            scopeId,
            params,
            requestedAt: new Date(),
        });
    }

    launchProcess(scopeId: string, processId: string) {
        const dbEntry = this.getProcess(scopeId, processId);

        ProcessCollection.update(dbEntry._id, {
            $unset: {
                'status.stoppedAt': true,
                'status.failedAt': true,
                'status.doneAt': true,
                'status.duration': true,
                'status.error': true,
            },
            $set: {
                'status.state': 'scheduled',
            },
        });

        RequestCollection.insert({
            type: 'launchProcess',
            scopeId,
            processId,
            requestedAt: new Date(),
        });
    }

    stopProcess(scopeId: string, processId: string) {
        const dbEntry = this.getProcess(scopeId, processId);
        ProcessCollection.update(dbEntry._id, {
            $set: {
                'status.state': 'stopRequested',
            },
        });

        RequestCollection.insert({
            type: 'stopProcess',
            scopeId,
            processId,
            requestedAt: new Date(),
        });
    }

    dismissProcessMessages(scopeId: string, processId: string) {
        const dbEntry = this.getProcess(scopeId, processId);
        ProcessCollection.update(dbEntry._id, {
            $unset: {
                'status.error': true,
                'status.failedAt': true,
                'status.stoppedAt': true,
                progress: true,
            },
            $set: {
                'status.state': 'idle',
            },
        });
    }
}
