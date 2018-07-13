import { computed } from 'mobx';
import { t } from '../i18n/i18n';
import { Wizard } from './Wizard';
import { WizardStep } from './WizardStep';

export interface WizardStepOptions {
    title: string;
    description?: string;
    isComplete?: () => boolean;
    defaultNextLabel?: string;

    /**
     * called before the step is entered, but not when `back` is called
     */
    beforeActivation?(): void;

    /**
     * Is called when `next` is hit.
     */
    afterNext?(): void;
}

export class WizardStepImpl implements WizardStep {
    readonly wizard: Wizard;
    readonly id: string;
    private readonly _title: string;
    private readonly _description?: string;
    private readonly isComplete?: () => boolean;

    constructor(wizard: Wizard, id: string, private readonly settings: WizardStepOptions) {
        this.wizard = wizard;
        this.id = id;
        this._title = settings.title;
        this._description = settings.description;
        this.isComplete = settings.isComplete;
    }

    beforeActivation() {
        if (this.settings.beforeActivation) {
            this.settings.beforeActivation();
        }
    }

    afterNext() {
        if (this.settings.afterNext) {
            this.settings.afterNext();
        }
    }

    get label(): string {
        return t(`${this.wizard.wizardId}.${this.id}.nextLabel`, this.settings.defaultNextLabel || 'Next >');
    }

    get title(): string {
        return t(`${this.wizard.wizardId}.${this.id}.title`, this._title);
    }

    get description(): string {
        return t(`${this.wizard.wizardId}.${this.id}.description`, this._description || '');
    }

    @computed
    get active(): boolean {
        return this === this.wizard.currentStep;
    }

    @computed
    get completed(): boolean {
        return this.wizard.steps.indexOf(this) < this.wizard.steps.indexOf(this.wizard.currentStep);
    }

    @computed
    get isStepComplete() {
        if (this.isComplete) {
            return this.isComplete();
        }
        return true;
    }

    @computed
    get disabled(): boolean {
        return !this.active && !this.completed;
    }
}
