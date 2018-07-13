import { Value } from '../value/Value';

export interface Text extends Value<string> {
    control?: 'input' | 'textarea';
}
