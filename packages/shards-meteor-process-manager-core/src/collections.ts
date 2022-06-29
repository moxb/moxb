import type { Mongo as CorrectMongo } from 'meteor/mongo';
import { ProcessRecord } from './types';

console.log('Latest code');

export const ProcessCollection = new Mongo.Collection<ProcessRecord>(
    'background-process-manager---processes'
) as CorrectMongo.Collection<ProcessRecord, ProcessRecord>;
