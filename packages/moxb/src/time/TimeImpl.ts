import * as moment from 'moment';
import { ValueImpl, ValueOptions } from '../value/ValueImpl';
import { Time } from './Time';

export interface TimeOptions extends ValueOptions<TimeImpl, moment.Moment> {}

export class TimeImpl extends ValueImpl<TimeImpl, moment.Moment, TimeOptions> implements Time {
    readonly impl: TimeOptions;

    constructor(impl: TimeOptions) {
        super(impl);
        this.impl = impl;
    }
}
