import {
    ProcessCollection,
    DefineProcessesParams,
    ProcessController,
    injectProcessController,
} from '@moxb/shards-meteor-process-manager-core';
import { RequestCollection } from './collections';

export interface ProcessControllerProps {
    /**
     * Do we need to restrict access to process control?
     *
     * If yes, provide a function that makes the access control decisions based on (Meteor) user ID and data scope ID.
     */
    auth?: (userId: string | null, scopeId: string, reason: string) => boolean;
}

class ProcessControllerImpl implements ProcessController {
    constructor(private readonly props: ProcessControllerProps) {
        injectProcessController(this);
    }

    private _locateProcess(scopeId: string, processId: string) {
        const dbEntry = ProcessCollection.findOne({ scopeId, processId });
        if (!dbEntry) {
            throw new Error(`Process "${processId}" (in scope ${scopeId}) not found!`);
        }
        return { dbEntry };
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
        const { dbEntry } = this._locateProcess(scopeId, processId);

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
        const { dbEntry } = this._locateProcess(scopeId, processId);
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
        const { dbEntry } = this._locateProcess(scopeId, processId);
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

export function initProcessController(props: ProcessControllerProps) {
    new ProcessControllerImpl(props);
}
