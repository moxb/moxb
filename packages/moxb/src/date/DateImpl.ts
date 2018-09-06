import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { Date } from './Date';

export interface DateOptions extends ValueOptions<DateImpl, string> {}

export class DateImpl extends ValueImpl<DateImpl, string, DateOptions> implements Date {
    readonly impl: DateOptions;

    constructor(impl: DateOptions) {
        super(impl);
        this.impl = impl;
    }
}
