const MyURI = require('urijs');
import { Location as MyLocation } from 'history';
import { UrlSchema, Query } from './UrlSchema';

export interface Props {
    pathKey?: string;
    cleanSeparatorFromPathEnd?: boolean;
}

export class QueryBasedUrlSchema implements UrlSchema {
    protected readonly _pathKey: string;

    public constructor(props: Props = {}) {
        const { pathKey } = props;
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

    public getLocation(location: MyLocation, pathTokens: string[], query: Query): MyLocation {
        const path: Query = {};
        if (pathTokens.length) {
            path[this._pathKey] = pathTokens.join('.');
        }
        const realQuery = {
            ...path,
            ...query,
        };
        return {
            ...location,
            search: new MyURI().search(realQuery).search(),
        };
    }
}
