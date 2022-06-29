import { Mongo } from 'meteor/mongo';
import type { ProcessRecord } from './types';

export const ProcessCollection = new Mongo.Collection<ProcessRecord>('background-process-manager---processes');
