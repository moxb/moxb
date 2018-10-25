import { Location as MyLocation } from 'history';

export interface Query {
    [key: string]: string;
}

export interface UrlSchema {
    getPathTokens(location: MyLocation): string[];
    getQuery(location: MyLocation): Query;
    getLocation(location: MyLocation, pathTokens: string[], query: Query): MyLocation;
}
