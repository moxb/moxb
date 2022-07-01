import type { ProcessDefinition } from '@moxb/shards-meteor-process-manager-core';
import { ProcessManagerWorkerImpl } from './ProcessManagerWorkerImpl';

export interface ProcessManagerWorkerProps<ScopeData = void> {
    /**
     * Prepare the scope data required for the processes from the scope ID
     */
    getScopeData: (scopeId: string) => ScopeData;

    /**
     * Get all process definitions
     */
    getProcessList: (scopeData: ScopeData) => ProcessDefinition<ScopeData>[];
}

/**
 * Launch a worker node
 */
export function initProcessManagerWorker<ScopeData = void>(props: ProcessManagerWorkerProps<ScopeData>) {
    new ProcessManagerWorkerImpl<ScopeData>(props);
}
