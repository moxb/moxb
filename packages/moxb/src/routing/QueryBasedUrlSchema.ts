const MyURI = require('urijs');
import { Location as MyLocation } from 'history';
import { UrlSchema, Query } from './UrlSchema';
import { LocationManager } from './LocationManager';

export interface Props {
    locationManager: LocationManager;
    pathKey?: string;
    cleanSeparatorFromPathEnd?: boolean;
}

export class QueryBasedUrlSchema implements UrlSchema {
    protected readonly _locationManager: LocationManager;
    protected readonly _pathKey: string;

    public constructor(props: Props) {
        const { locationManager, pathKey } = props;
        this._locationManager = locationManager;
        this._pathKey = pathKey || 'path';
    }

    public getPathTokens(location: MyLocation): string[] {
        const query = new MyURI().search(location.search).search(true);
        const pathname = query[this._pathKey] || '';
        const raw: string = pathname[0] === '.' ? pathname.substr(1) : pathname;
        const tokens = raw.split('.').filter(t => t.length);
        return tokens;
    }

    public getQuery(location: MyLocation): Query {
        const query = new MyURI().search(location.search).search(true);
        delete query[this._pathKey];
        return query;
    }

    public getLocation(pathTokens: string[], query: Query): MyLocation {
        const path: Query = {};
        if (pathTokens.length) {
            path[this._pathKey] = pathTokens.join('.');
        }
        const realQuery = {
            ...path,
            ...query,
        };
        return {
            ...this._locationManager.location,
            search: new MyURI().search(realQuery).search(),
        };
    }
}
