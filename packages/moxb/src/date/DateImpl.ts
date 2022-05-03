import * as moment from 'moment';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { Date } from './Date';

export type DateOptions = ValueOptions<DateImpl, moment.Moment>;

export class DateImpl extends ValueImpl<DateImpl, moment.Moment, DateOptions> implements Date {
    readonly impl: DateOptions;

    constructor(impl: DateOptions) {
        super(impl);
        this.impl = impl;
    }
}
