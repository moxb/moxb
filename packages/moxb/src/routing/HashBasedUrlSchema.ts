const MyURI = require('urijs');
import { Location as MyLocation } from 'history';
import { UrlSchema, Query } from './UrlSchema';

export interface Props {}

export class HashBasedUrlSchema implements UrlSchema {
    public constructor(_props: Props) {}

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
        return {
            ...location,
            hash: '/' + pathTokens.join('/') + new MyURI().search(query).search(),
        };
    }
}
