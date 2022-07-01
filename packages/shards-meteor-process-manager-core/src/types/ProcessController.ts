import type { ProcessRecord } from './ProcessRecord';

export interface DefineProcessesParams {
    onlyIfMissing?: boolean;
    clean?: boolean;
}

/**
 * The Process Controller is responsible for controlling what happens around the processes.
 */
export interface ProcessController {
    /**
     * Make sure that we have the definition of all the processes
     */
    defineProcesses: (scopeId: string, params?: DefineProcessesParams) => void;

    /**
     * Look up the status and progress of a process
     */
    getProcess: (scopeId: string, processId: string) => ProcessRecord;

    /**
     * Execute a process
     */
    launchProcess: (scopeId: string, processId: string) => void;

    /**
     * Stop a process
     */
    stopProcess: (scopeId: string, processId: string) => void;

    /**
     * Dismiss any error messages
     */
    dismissProcessMessages: (scopeId: string, processId: string) => void;

    /**
     * Make sure that the given user is allowed to execute process in a given scope
     */
    verifyScopeAccess: (userId: string | null, scopeId: string, reason: string) => void;
}
