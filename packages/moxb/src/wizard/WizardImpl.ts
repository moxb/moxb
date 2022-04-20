import { action, computed, observable, makeObservable } from 'mobx';
import { Action } from '../action/Action';
import { ActionImpl } from '../action/ActionImpl';
import { BindImpl } from '../bind/BindImpl';
import { Confirm } from '../confirm/Confirm';
import { ConfirmImpl } from '../confirm/ConfirmImpl';
import { t } from '../i18n/i18n';
import { toId } from '../util/toId';
import { Wizard } from './Wizard';
import { WizardStep } from './WizardStep';

const KEY_CURRENT_STEP = '.wizard.stepId';

export abstract class WizardImpl implements Wizard {
    readonly wizardId: string;
    readonly steps: WizardStep[];
    @observable
    currentStep: WizardStep;
    readonly actionBack: Action;
    readonly actionCancel: Action;
    readonly actionNext: Action;
    readonly confirmCancel: Confirm<undefined>;
    private initialized = false;

    constructor(id: string, protected storage: Storage) {
        makeObservable(this);
        this.wizardId = id;
        this.steps = this.createSteps();
        this.actionBack = new ActionImpl({
            id: toId(id, 'actionBack'),
            label: '< Back',
            invisible: () => this.prevStep == null,
            enabled: () => this.prevStep != null,
            fire: () => this.setCurrentStep(this.prevStep),
        });
        this.actionCancel = new ActionImpl({
            id: toId(id, 'actionCancel'),
            label: 'Cancel',
            fire: () => this.cancel(),
        });
        this.actionNext = new ActionImpl({
            id: toId(id, 'actionNext'),
            label: () => this.currentStep.label,
            invisible: () => this.nextStep == null,
            enabled: () => this.currentStep.isStepComplete,
            fire: () => this.setCurrentStep(this.nextStep),
        });
        this.currentStep = this.steps[0];
        this.confirmCancel = new ConfirmImpl({
            confirmButton: new BindImpl({
                id: toId(id, 'actionCancelImport.no'),
                label: 'No',
            }),
            cancelButton: new BindImpl({
                id: toId(id, 'actionCancelImport.yes'),
                label: 'Yes',
            }),
            content: () => t(this.wizardId + '.actionCancelImport.content', 'Do you want to end the Wizard?'),
            cancel: () => this.doCancel(),
        });
    }

    initialize() {
        const stepId = this.storage.getItem(this.wizardId + KEY_CURRENT_STEP);
        if (stepId) {
            this.setCurrentStep(this.steps.find((s) => s.id === stepId) || this.currentStep);
        }
        this.initialized = true;
    }

    protected abstract createSteps(): WizardStep[];

    @action
    private setCurrentStep(step: WizardStep | undefined) {
        if (this.currentStep) {
            this.currentStep.afterNext();
        }
        if (!step) {
            return;
        }
        const isNext = this.steps.indexOf(this.currentStep) < this.steps.indexOf(step);
        this.currentStep = step;
        if (isNext) {
            // only if we move forward, we have to activate the step...
            this.currentStep.beforeActivation();
        }
        this.saveCurrentStep(step);
    }

    /**
     * Remembers the current step after a reload...
     * @param {} step
     */
    protected saveCurrentStep(step: WizardStep) {
        this.storage.setItem(this.wizardId + KEY_CURRENT_STEP, step.id);
    }

    @computed
    private get currentStepIndex() {
        return this.steps.indexOf(this.currentStep);
    }

    @computed
    private get prevStep(): WizardStep | undefined {
        const prevIndex = this.currentStepIndex - 1;
        if (prevIndex < 0) {
            return undefined;
        }
        return this.steps[prevIndex];
    }

    @computed
    private get nextStep(): WizardStep | undefined {
        if (!this.initialized) {
            console.error('Wizard not initialzed!');
        }
        const nextStep = this.currentStepIndex + 1;
        if (nextStep >= this.steps.length) {
            return undefined;
        }
        return this.steps[nextStep];
    }

    gotoStep(step: WizardStep) {
        if (!step.disabled) {
            this.setCurrentStep(step);
        }
    }

    private cancel() {
        this.confirmCancel.show();
    }

    protected doCancel() {
        this.resetDialog();
    }

    @action
    protected resetDialog() {
        this.storage.removeItem(this.wizardId + KEY_CURRENT_STEP);
        this.currentStep = this.steps[0];
    }
}
