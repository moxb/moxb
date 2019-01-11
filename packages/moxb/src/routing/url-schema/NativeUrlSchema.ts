const MyURI = require('urijs');
import { Location as MyLocation } from 'history';
import { Query, UrlSchema } from './UrlSchema';

/**
 * This is simple URL schema that uses the native path and search feature.
 *
 * This looks nice in the URL, but is only applicable if server-side routing is set up
 * in such a way that will return the app consistently, even if the path is different.
 */
export class NativeUrlSchema implements UrlSchema {
    public getPathTokens(location: MyLocation): string[] {
        const pathname = location.pathname;
        const raw = pathname[0] === '/' ? pathname.substr(1) : pathname;
        return raw.split('/').filter(token => token.length);
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
