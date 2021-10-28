import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import * as moment from 'moment';
import { DateRange } from './DateRange';
import { computed } from 'mobx';

export interface DateRangeOptions extends ValueOptions<DateRangeImpl, [moment.Moment, moment.Moment]> {
    ranges?: Record<string, [moment.Moment, moment.Moment]>;
}

export class DateRangeImpl
    extends ValueImpl<DateRangeImpl, [moment.Moment, moment.Moment], DateRangeOptions>
    implements DateRange {
    readonly impl: DateRangeOptions;

    constructor(impl: DateRangeOptions) {
        super(impl);
        this.impl = impl;
    }

    @computed
    get ranges() {
        return this.impl.ranges;
    }
}
