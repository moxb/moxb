import { Value } from '../value/Value';

export interface BindOneOfChoice<T = string> {
    value: T;

    /**
     * If no label specified, the value is used as label
     */
    label?: string;

    /**
     * If we want to use a specific widget for the label, instead of a simple string, specify it there.
     */
    widget?: any;
}

export interface OneOf<T = string> extends Value<T> {
    readonly choices: BindOneOfChoice<T>[];
    readonly choice: string | undefined;
}
