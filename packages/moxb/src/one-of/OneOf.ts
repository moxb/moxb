import { Value } from '../value/Value';

export interface BindOneOfChoice {
    value: string;
    /**
     * If no label specified, the value is used as label
     */
    label?: string;
}

export interface OneOf extends Value<string> {
    readonly choices: BindOneOfChoice[];
}
