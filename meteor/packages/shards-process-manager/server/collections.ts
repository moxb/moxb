import { Mongo } from 'meteor/mongo';
import { ProcessRequest } from './types';

export const RequestCollection = new Mongo.Collection<ProcessRequest>('background-process-manager---requests');
