import { Action } from '../action/Action';
import { Confirm } from '../confirm/Confirm';
import { WizardStep } from './WizardStep';

export interface Wizard {
    readonly wizardId: string;
    readonly steps: WizardStep[];

    gotoStep(step: WizardStep): void;

    readonly currentStep: WizardStep;
    readonly actionBack: Action;
    readonly actionCancel: Action;
    readonly actionNext: Action;
    readonly confirmCancel: Confirm<undefined>;

    /**
     * Has to be called after the wizard has been created
     */
    initialize(): void;
}
