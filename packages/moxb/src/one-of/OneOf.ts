import { Value } from '../value/Value';

export interface BindOneOfChoice {
    value: string;

    /**
     * If no label specified, the value is used as label
     */
    label?: string;

    /**
     * If we want to use a specific widget for the label, instead of a simple string, specify it there.
     */
    widget?: any;
}

export interface OneOf extends Value<string> {
    readonly choices: BindOneOfChoice[];
}
