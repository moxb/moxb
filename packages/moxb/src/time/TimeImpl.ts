import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { Time } from './Time';

export interface TimeOptions extends ValueOptions<TimeImpl, string> {}

export class TimeImpl extends ValueImpl<TimeImpl, string, TimeOptions> implements Time {
    readonly impl: TimeOptions;

    constructor(impl: TimeOptions) {
        super(impl);
        this.impl = impl;
    }
}
