const MyURI = require('urijs');
import { Location as MyLocation } from 'history';
import { UrlSchema, Query } from './UrlSchema';
import { LocationManager } from './LocationManager';

export interface Props {
    locationManager: LocationManager;
}

export class NativeUrlSchema implements UrlSchema {
    protected readonly _locationManager: LocationManager;

    public constructor(props: Props) {
        const { locationManager } = props;
        this._locationManager = locationManager;
    }

    public getPathTokens(location: MyLocation): string[] {
        const pathname = location.pathname;
        const raw = pathname[0] === '/' ? pathname.substr(1) : pathname;
        return raw.split('/');
    }

    public getQuery(location: MyLocation): Query {
        return new MyURI().search(location.search).search(true);
    }

    public getLocation(pathTokens: string[], query: Query): MyLocation {
        return {
            ...this._locationManager.location,
            pathname: '/' + pathTokens.join('/'),
            search: new MyURI().search(query).search(),
        };
    }
}
