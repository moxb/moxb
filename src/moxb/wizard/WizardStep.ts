export interface WizardStep {
    readonly id: string;
    readonly active: boolean;
    readonly label: string;
    /**
     * all conditions are satisfied to start the next step
     */
    readonly isStepComplete: boolean;
    readonly completed: boolean;
    readonly disabled: boolean;
    readonly title: string;
    readonly description: string;

    beforeActivation(): void;

    afterNext(): void;
}
