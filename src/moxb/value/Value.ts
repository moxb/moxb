import { Bind } from '../bind/Bind';

export interface Value<T> extends Bind {
    /**
     * used to define the input type of the control
     */
    readonly inputType?: string;
    readonly value?: T;
    readonly placeholder?: string;

    /**
     * If the value is same as he initial value.
     */
    readonly isInitialValue?: boolean;

    /**
     * Resets the value to the initialValue.
     */
    resetToInitialValue(): void;

    /**
     * Call to trigger onSave on the options object
     */
    save(): void;

    /**
     * while save is happening.
     */
    readonly isSaving: boolean;

    setValue(value: T): void; // is bound!
    onEnterField(): void; // is called onFocus
    onExitField(): void; // is called onBlur
}
