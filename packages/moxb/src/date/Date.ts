import * as moment from 'moment';
import { Value } from '../value/Value';

export interface Date extends Value<moment.Moment> {}
