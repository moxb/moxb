import type { Mongo } from 'meteor/mongo';
import { MeteorDataFetcher } from './MeteorDataFetcher';

export interface MeteorTableData<T> {
    readonly totalCount: number;
    readonly data: T[];
    readonly error?: Meteor.Error;
}

export interface MeteorTableQuery {
    queryString: string; // this string will be parsed by the server!
    selector?: Mongo.Selector<any>;
    options: Mongo.FindOptions;
}

export type MeteorTableFetcher<T> = MeteorDataFetcher<MeteorTableQuery, MeteorTableData<T>>;
