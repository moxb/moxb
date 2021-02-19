import { Value } from '../value/Value';

export interface BindOneOfChoice<T = string> {
    value: T;

    /**
     * If no label specified, the value is used as label
     */
    label?: string;

    /**
     * If we would like to display some explanation for this choice, put it here.
     */
    help?: string;

    /**
     * If we want to use a specific widget for the label, instead of a simple string, specify it there.
     */
    widget?: any;

    /**
     * Signal that this element should not be available for choice
     */
    disabled?: boolean;

    /**
     * Explanation why this can't be chosen
     */
    reason?: string;
}

export interface OneOf<T = string> extends Value<T> {
    readonly choices: BindOneOfChoice<T>[];
    readonly choice: string | undefined;
    searchData(value: string): void;
    readonly filteredChoices: BindOneOfChoice<T>[];
}
