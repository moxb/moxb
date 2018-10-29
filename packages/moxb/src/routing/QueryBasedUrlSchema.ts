const MyURI = require('urijs');
import { Location as MyLocation } from 'history';
import { UrlSchema, Query } from './UrlSchema';

export interface Props {
    pathKey?: string;
}

/**
 * This is a URL schema that stores the path as a special search parameter.
 *
 * This is a possible workaround for situations where the NativeUrlSchema can't be used.
 */
export class QueryBasedUrlSchema implements UrlSchema {
    protected readonly _pathKey: string;

    public constructor(props: Props = {}) {
        const { pathKey } = props;
        this._pathKey = pathKey || 'path';
    }

    public getPathTokens(location: MyLocation): string[] {
        const query = new MyURI().search(location.search).search(true);
        const pathname = query[this._pathKey] || '';
        const raw: string = pathname[0] === '/' ? pathname.substr(1) : pathname;
        return raw.split('/').filter(t => t.length);
    }

    public getQuery(location: MyLocation): Query {
        const query = new MyURI().search(location.search).search(true);
        // tslint:disable-next-line:no-dynamic-delete
        delete query[this._pathKey];
        return query;
    }

    public getLocation(location: MyLocation, pathTokens: string[], query: Query): MyLocation {
        const path: Query = {};
        if (pathTokens.length) {
            path[this._pathKey] = '/' + pathTokens.join('/');
        }
        const realQuery = {
            ...path,
            ...query,
        };
        return {
            ...location,
            search: new MyURI()
                .search(realQuery)
                .search()
                .replace(/%2F/g, '/'),
        };
    }
}
