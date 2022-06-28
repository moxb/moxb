export type ProcessState =
    | 'idle'
    | 'scheduled'
    | 'running'
    | 'failed'
    | 'stopRequested'
    | 'stopping'
    | 'stopped'
    | 'done';
export type ProcessEndState = 'failed' | 'stopped' | 'done';

export interface ProcessStatus {
    /**
     * The current state of the process
     */
    state: ProcessState;

    /**
     * Error from previous attempt (is any)
     */
    error?: string;

    /**
     * Start date (if any)
     */
    runningSince?: Date;

    /**
     * Completion date (if any)
     */
    doneAt?: Date;

    /**
     * How long did it take to finish this process?
     */
    duration?: number;

    /**
     * Stopping date (if any)
     */
    stoppedAt?: Date;

    /**
     * Failure date (if any)
     */
    failedAt?: Date;
}

export interface ProgressStatus {
    message: string;
    rate: number;
}

interface RunProcessParams {
    /**
     * Should teh parent process continue to run even if the child process fails?
     */
    surviveFailure?: boolean;

    /**
     * Should the parent process continue to run even if the child process is stopped?
     */
    surviveStopping?: boolean;
}

export type ProgressReporter = (message: string, rate: number) => void;

export interface ProcessContext<ExtraContext> {
    scopeId: string;
    reportProgress: ProgressReporter;
    shouldContinue: () => boolean;
    runProcess: (process: ProcessDefinition<ExtraContext>, params?: RunProcessParams) => ProcessEndState;
}

export interface ProcessDefinition<ExtraContext = {}> {
    processId: string;
    name: string;
    warning?: string;

    /**
     * Is this process normally executed as part of something else?
     *
     * 1: top-level task (there should be only one for each use case.)
     * 2: direct sub-task of top-level task
     * 3: second level sub-task
     * 4: channel-level nitty-gritty
     */
    detailLevel: number;

    /**
     * Is this process only useful for debugging or other special purposes?
     */
    special?: boolean;
    execute: (context: ProcessContext<ExtraContext> & ExtraContext) => void;
}

export interface ProcessRecord extends Omit<ProcessDefinition, 'execute'> {
    _id: string;
    scopeId: string;
    status?: ProcessStatus;
    progress?: ProgressStatus;
}
