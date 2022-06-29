import { Mongo } from 'meteor/mongo';
import type { ProcessRequest } from './types';

export const RequestCollection = new Mongo.Collection<ProcessRequest>('background-process-manager---requests');
