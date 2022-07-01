import { ProcessDefinition } from './ProcessDefinition';
import { ProcessStatus } from './ProcessStatus';
import { ProgressStatus } from './ProcessContext';

/**
 * Info about the definition and current status of a process.
 *
 * We are storing these in a Mongo collection.
 */
export interface ProcessRecord extends Omit<ProcessDefinition, 'execute'> {
    _id: string;
    scopeId: string;
    status?: ProcessStatus;
    progress?: ProgressStatus;
}
