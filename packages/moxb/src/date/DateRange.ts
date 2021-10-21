import * as moment from 'moment';
import { Value } from '../value/Value';

export interface DateRange extends Value<[moment.Moment, moment.Moment]> {}
