import type { DefineProcessesParams } from '../api/controller';

export type RequestType = 'defineProcesses' | 'launchProcess' | 'stopProcess';

export interface ProcessRequestCore {
    _id: string;
    scopeId: string;
    type: RequestType;
    requestedAt: Date;
    takenByWorker?: string;
}

export interface DefineProcessesRequest extends ProcessRequestCore {
    type: 'defineProcesses';
    params: DefineProcessesParams;
}

export interface LaunchProcessRequest extends ProcessRequestCore {
    type: 'launchProcess';
    processId: string;
}

export interface StopProcessRequest extends ProcessRequestCore {
    type: 'stopProcess';
    processId: string;
}

export type ProcessRequest = DefineProcessesRequest | LaunchProcessRequest | StopProcessRequest;
