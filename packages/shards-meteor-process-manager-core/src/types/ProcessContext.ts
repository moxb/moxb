/**
 * Info about the progress of a process
 */
import { ProcessEndState } from './ProcessStatus';
import { ProcessDefinition } from './ProcessDefinition';

export interface ProgressStatus {
    /**
     * What is going on?
     */
    message: string;

    /**
     * Where are we in the process?
     *
     * Should be between 0 and 1.
     */
    rate: number;
}

/**
 * Optional behaviors when running a sub-process
 */
interface RunProcessParams {
    /**
     * Should the parent process continue to run even if the child process fails?
     */
    surviveFailure?: boolean;

    /**
     * Should the parent process continue to run even if the child process is stopped?
     */
    surviveStopping?: boolean;
}

/**
 * A function for reporting progress
 */
export type ProgressReporter = (message: string, rate: number) => void;

/**
 * This is the control interface the executed process _receive_ from the system.
 *
 * The process can use this API for talking to the rest of the system.
 */
export interface ProcessContext<ExtraContext> {
    /**
     * Identify the scope we are supposed to work in.
     */
    scopeId: string;

    /**
     * Report the progress
     */
    reportProgress: ProgressReporter;

    /**
     * Should we even be doing this?
     *
     * Check this often, and if it becomes false, don't bother running any more.
     */
    shouldContinue: () => boolean;

    /**
     * Request the execution of a child process.
     */
    runProcess: (process: ProcessDefinition<ExtraContext>, params?: RunProcessParams) => ProcessEndState;
}
