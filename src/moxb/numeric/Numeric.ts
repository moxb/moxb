import { Value } from '../value/Value';

export interface Numeric extends Value<number> {
    readonly onlyInteger?: boolean;
    readonly min?: number;
    readonly max?: number;
    readonly step?: number;
}
