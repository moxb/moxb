import { Value } from '../value/Value';

export interface Rate extends Value<number> {
    readonly count?: number; // Default is 5
    readonly allowClear?: boolean;
    readonly allowHalf?: boolean;
    readonly tooltips?: string[];
    readonly showValueLabel?: boolean;
}
