import { Value } from '../value/Value';

export interface BindManyOfChoice {
    value: string;
    /**
     * If no label specified, the value is used as label
     */
    label?: string;
}

export interface ManyOf extends Value<string[]> {
    readonly choices: BindManyOfChoice[];
}
