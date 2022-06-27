import { Action } from '@moxb/moxb';
import { UrlArg } from './url-arg';

export interface MultiStepProcess<Step> {
    readonly currentStep: UrlArg<Step>;

    readonly failed: boolean;
    readonly errorMessage?: string;
    readonly finished: boolean;

    // Navigate away
    readonly finish: Action;
}
