import { Value } from '../value/Value';

export interface BindManyOfChoice<T = string> {
    value: T;
    /**
     * If no label specified, the value is used as label
     */
    label?: string;
}

export interface ManyOf<T = string> extends Value<T[]> {
    readonly choices: BindManyOfChoice<T>[];
}
