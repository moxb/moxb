import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import * as moment from 'moment';
import { DateRange } from './DateRange';

export interface DateRangeOptions extends ValueOptions<DateRangeImpl, [moment.Moment, moment.Moment]> {}

export class DateRangeImpl
    extends ValueImpl<DateRangeImpl, [moment.Moment, moment.Moment], DateRangeOptions>
    implements DateRange {
    readonly impl: DateRangeOptions;

    constructor(impl: DateRangeOptions) {
        super(impl);
        this.impl = impl;
    }
}
