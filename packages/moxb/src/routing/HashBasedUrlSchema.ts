const MyURI = require('urijs');
import { Location as MyLocation } from 'history';
import { UrlSchema, Query } from './UrlSchema';

export interface Props {}

/**
 * This is a URL schema that stores the path and the URL arguments in the hash part of the URL.
 *
 * This is a possible workaround for situations where the NativeUrlSchema can't be used.
 */
export class HashBasedUrlSchema implements UrlSchema {
    public getPathTokens(location: MyLocation): string[] {
        const pathname = location.hash.split('?')[0].substr(2);
        const raw = pathname[0] === '/' ? pathname.substr(1) : pathname;
        const tokens = raw.split('/');
        return tokens;
    }

    public getQuery(location: MyLocation): Query {
        const qPos = location.hash.indexOf('?');
        if (qPos === -1) {
            return {};
        } else {
            return MyURI()
                .search(location.hash.substr(qPos))
                .search(true);
        }
    }

    public getLocation(location: MyLocation, pathTokens: string[], query: Query): MyLocation {
        const hash = '/' + pathTokens.join('/') + new MyURI().search(query).search();
        return {
            ...location,
            hash: hash === '/' ? '' : hash,
        };
    }
}
