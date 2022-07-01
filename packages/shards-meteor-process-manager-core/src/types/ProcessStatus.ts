/**
 * Define the possible states of a process
 */
export type ProcessState =
    | 'idle'
    | 'scheduled'
    | 'running'
    | 'failed'
    | 'stopRequested'
    | 'stopping'
    | 'stopped'
    | 'done';

/**
 * Define the possible end-states of a process
 */
export type ProcessEndState = 'failed' | 'stopped' | 'done';

/**
 * Info about the current status of a process
 */
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
