import { randomUUID } from 'crypto';

import type { OptionalId } from '@moxb/meteor';
import {
    ProcessContext,
    ProcessDefinition,
    ProcessEndState,
    ProcessRecord,
    ProgressReporter,
    ProcessCollection,
    DefineProcessesParams,
} from '@moxb/shards-meteor-process-manager-core';

import type { ProcessRequest } from './types';
import { RequestCollection } from './collections';

interface ProcessTracker<ExtraContext> extends ProcessDefinition<ExtraContext> {
    shouldRun: boolean;
}

interface ProcessManagerProps<ExtraContext = void> {
    /**
     * Prepare the context required for the processes from the scope ID
     */
    getContext: (scopeId: string) => ExtraContext;

    /**
     * Get all process definitions
     */
    getProcessList: (context: ExtraContext) => ProcessDefinition<ExtraContext>[];
}

class ProcessManagerImpl<ExtraContext = void> {
    private readonly _instanceId: string;

    constructor(private readonly props: ProcessManagerProps<ExtraContext>) {
        this._instanceId = randomUUID();
        console.log('Launched worker instance', this._instanceId);
        this._executeRequest = this._executeRequest.bind(this);
        this.listenForRequests();
    }

    private readonly _processes: Record<string, Record<string, ProcessTracker<ExtraContext>>> = {};

    private _defineImportProcess(scopeId: string, definition: ProcessDefinition<ExtraContext>) {
        const { processId } = definition;
        if (this._processes[scopeId] && this._processes[scopeId][processId]) {
            throw new Error(`Process "${processId}" is already defined!`);
        }
        if (!this._processes[scopeId]) {
            this._processes[scopeId] = {};
        }
        this._processes[scopeId][processId] = { ...definition, shouldRun: false };

        const dbEntry: OptionalId<ProcessRecord> = {
            scopeId,
            ...definition,
        };
        delete (dbEntry as any).execute;

        // console.log('Making sure we have process', dbEntry);
        ProcessCollection.upsert({ scopeId, processId }, { $set: dbEntry });
    }

    private _cleanUpProcesses(scopeId: string) {
        const dbEntries = ProcessCollection.find({ scopeId }).fetch();
        dbEntries.filter((e) => !this._processes[scopeId][e.processId]).forEach((e) => ProcessCollection.remove(e._id));
    }

    hasProcessesFor = (scopeId: string) => !!this._processes[scopeId];

    private _defineProcesses(scopeId: string, params: DefineProcessesParams = {}) {
        const { onlyIfMissing, clean } = params;
        if (onlyIfMissing) {
            if (this.hasProcessesFor(scopeId)) {
                return;
            }
        }
        if (clean) {
            delete this._processes[scopeId];
            ProcessCollection.remove({ scopeId });
        }
        const context = this.props.getContext(scopeId);
        const processes = this.props.getProcessList(context);
        processes.forEach((p) => this._defineImportProcess(scopeId, p));
        this._cleanUpProcesses(scopeId);
    }

    private _locateProcess(scopeId: string, processId: string) {
        const dbEntry = ProcessCollection.findOne({ scopeId, processId });
        const process = (this._processes[scopeId] || {})[processId];
        if (!process || !dbEntry) {
            throw new Error(`Process "${processId}" (in scope ${scopeId}) not found!`);
        }
        return { dbEntry, process };
    }

    private _stopProcess(scopeId: string, processId: string) {
        const { process, dbEntry } = this._locateProcess(scopeId, processId);
        console.log('Stopping process', processId, 'in scope', scopeId);
        process.shouldRun = false;
        ProcessCollection.update(dbEntry._id, {
            $set: {
                'status.state': 'stopping',
            },
        });
    }

    private _launchProcess(scopeId: string, processId: string): ProcessEndState {
        const { process, dbEntry } = this._locateProcess(scopeId, processId);
        console.log(`Executing process "${process.name}" in scope ${scopeId} ...`);

        const runningSince = new Date();

        ProcessCollection.update(dbEntry._id, {
            $unset: {
                'status.stoppedAt': true,
                'status.failedAt': true,
                'status.doneAt': true,
                'status.duration': true,
                'status.error': true,
            },
            $set: {
                'status.runningSince': runningSince,
                'status.state': 'running',
            },
        });

        const reportProgress: ProgressReporter = (message, rate) => {
            // console.log(`Progress on ${processId}:`, rate, message);
            ProcessCollection.update(dbEntry._id, {
                $set: {
                    'progress.message': message,
                    'progress.rate': rate,
                },
            });
        };

        try {
            reportProgress('Starting...', 0);
            process.shouldRun = true;

            const coreContext: ProcessContext<ExtraContext> = {
                scopeId,
                reportProgress,
                shouldContinue: () => process.shouldRun,
                runProcess: (subProcess, params = {}) => {
                    const { surviveFailure, surviveStopping } = params;
                    const result = this._launchProcess(scopeId, subProcess.processId);
                    switch (result) {
                        case 'done':
                            return result;
                        case 'stopped':
                            if (!surviveStopping) {
                                this._stopProcess(scopeId, processId);
                            }
                            return 'stopped';
                        case 'failed':
                            if (surviveFailure) {
                                return 'failed';
                            } else {
                                throw new Error(`Failed to ${subProcess.name}.`);
                            }
                    }
                },
            };

            const { getContext } = this.props;
            const extraContext = getContext(scopeId);

            const context: ProcessContext<ExtraContext> & ExtraContext = {
                ...coreContext,
                ...extraContext,
            };

            process.execute(context);
            if (process.shouldRun) {
                // Process finished normally
                reportProgress('All done', 1);
                const now = new Date();
                const duration = (now.getTime() - runningSince.getTime()) / 1000;
                console.log(`Process "${process.name}" has finished in ${duration} seconds.`);
                ProcessCollection.update(dbEntry._id, {
                    $unset: {
                        'status.runningSince': true,
                    },
                    $set: {
                        'status.state': 'done',
                        'status.doneAt': now,
                        'status.duration': duration,
                    },
                });
                return 'done';
            } else {
                console.log(`Process "${process.name}" has been stopped.`);
                // Process has been stopped before finishing
                process.shouldRun = false;
                ProcessCollection.update(dbEntry._id, {
                    $unset: {
                        'status.runningSince': true,
                    },
                    $set: {
                        'status.state': 'stopped',
                        'status.stoppedAt': new Date(),
                    },
                });
                return 'stopped';
            }
        } catch (error: any) {
            console.log(`Process "${process.name}" has failed:`, error);
            ProcessCollection.update(dbEntry._id, {
                $unset: {
                    'status.runningSince': true,
                },
                $set: {
                    'status.error': error?.message || 'failed',
                    'status.state': 'failed',
                    'status.failedAt': new Date(),
                },
            });
            return 'failed';
        }
    }

    private _executeRequest(request: ProcessRequest) {
        const { scopeId } = request;

        RequestCollection.update(
            { _id: request._id, takenByWorker: { $exists: false } },
            { $set: { takenByWorker: this._instanceId } }
        );
        const dbEntry = RequestCollection.findOne(request._id);

        if (!dbEntry || dbEntry.takenByWorker !== this._instanceId) {
            console.log('Failed to grab request. I guess someone else will do it.', dbEntry, dbEntry?.takenByWorker);
            return;
        }

        try {
            switch (request.type) {
                case 'defineProcesses':
                    this._defineProcesses(scopeId, request.params);
                    break;
                case 'launchProcess':
                    this._launchProcess(scopeId, request.processId);
                    break;
                case 'stopProcess':
                    this._stopProcess(scopeId, request.processId);
                    break;
                default:
                    console.log('Warning: unknown request type', (request as any).type);
            }
        } catch (error) {
            console.log('Error while executing request', request.type, error);
        }
    }

    private listenForRequests() {
        const cursor = RequestCollection.find({ takenByWorker: { $exists: false } }, { sort: { requestedAt: 1 } });
        cursor.forEach((req) => this._executeRequest(req));
        cursor.observe({
            added: this._executeRequest,
        });
    }
}

export function initProcessManager<ExtraContext>(props: ProcessManagerProps<ExtraContext>) {
    new ProcessManagerImpl<ExtraContext>(props);
}
