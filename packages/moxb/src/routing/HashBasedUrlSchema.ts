const MyURI = require('urijs');
import { Location as MyLocation } from 'history';
import { UrlSchema, Query } from './UrlSchema';
import { LocationManager } from './LocationManager';

export interface Props {
    locationManager: LocationManager;
}

export class HashBasedUrlSchema implements UrlSchema {
    protected readonly _locationManager: LocationManager;

    public constructor(props: Props) {
        const { locationManager } = props;
        this._locationManager = locationManager;
    }

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

    public getLocation(pathTokens: string[], query: Query): MyLocation {
        return {
            ...this._locationManager.location,
            hash: '/' + pathTokens.join('/') + new MyURI().search(query).search(),
        };
    }
}
