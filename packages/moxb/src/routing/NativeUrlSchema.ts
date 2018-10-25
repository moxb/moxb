const MyURI = require('urijs');
import { Location as MyLocation } from 'history';
import { UrlSchema, Query } from './UrlSchema';

export class NativeUrlSchema implements UrlSchema {
    public getPathTokens(location: MyLocation): string[] {
        const pathname = location.pathname;
        const raw = pathname[0] === '/' ? pathname.substr(1) : pathname;
        return raw.split('/');
    }

    public getQuery(location: MyLocation): Query {
        return new MyURI().search(location.search).search(true);
    }

    public getLocation(location: MyLocation, pathTokens: string[], query: Query): MyLocation {
        return {
            ...location,
            pathname: '/' + pathTokens.join('/'),
            search: new MyURI().search(query).search(),
        };
    }
}
