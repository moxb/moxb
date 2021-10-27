import * as moment from 'moment';
import { Value } from '../value/Value';

export interface DateRange extends Value<[moment.Moment, moment.Moment]> {
    /*
     * List of predetermined date range selectors which can be easily selected on the ui.
     * I.e. select current month / week, etc.
     */
    readonly ranges: Record<string, [moment.Moment, moment.Moment]> | undefined;
}
