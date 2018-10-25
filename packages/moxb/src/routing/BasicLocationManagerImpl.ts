import { observable, action } from 'mobx';
import { UrlSchema, Query } from './UrlSchema';
import { NativeUrlSchema } from './NativeUrlSchema';
import { QueryBasedUrlSchema } from './QueryBasedUrlSchema';
import { HashBasedUrlSchema } from './HashBasedUrlSchema';
import { UrlArg } from './UrlArg';

// We are renaming these types so that it's not confused with the builtin
const MyURI = require('urijs');
import {
    Location as MyLocation,
    History as MyHistory,
    LocationDescriptorObject,
    createBrowserHistory,
} from 'history';

import { LocationManager, QueryChange } from './LocationManager';

const debug = false;

export const PATH_STRATEGY = {
    NATIVE: 'native',
    QUERY: 'query',
    HASH: 'hash',
};

export type PathStrategy = typeof PATH_STRATEGY.NATIVE | typeof PATH_STRATEGY.QUERY | typeof PATH_STRATEGY.HASH;

const noLocation: MyLocation = {
    pathname: '',
    search: '',
    state: null,
    hash: '',
    key: '',
};

export interface Props {
    pathStrategy?: PathStrategy;
}

const locationToUrl = (location: MyLocation): string =>
    new MyURI()
        .path(location.pathname)
        .search(location.search)
        .hash((location as any).hash)
        .toString();

export class BasicLocationManagerImpl implements LocationManager {
    protected readonly _schema: UrlSchema;
    protected readonly _permanentArgs: UrlArg<any>[] = [];

    public constructor(props: Props) {
        switch (props.pathStrategy || PATH_STRATEGY.NATIVE) {
            case PATH_STRATEGY.NATIVE:
                this._schema = new NativeUrlSchema({ locationManager: this });
                break;
            case PATH_STRATEGY.QUERY:
                this._schema = new QueryBasedUrlSchema({ locationManager: this });
                break;
            case PATH_STRATEGY.HASH:
                this._schema = new HashBasedUrlSchema({ locationManager: this });
                break;
            default:
                throw new Error('Unsupported strategy');
        }
    }

    // Private field to actually follow the browser history
    private _history: MyHistory = createBrowserHistory();

    // Private field to store the final bit.
    @observable
    private _final: boolean = true;
    // Getters and setters for the final bit
    public get final() {
        return this._final;
    }
    public get temporary() {
        return !this._final;
    }
    public set final(value: boolean) {
        this._final = value;
    }
    public set temporary(value: boolean) {
        this._final = !value;
    }

    // Private field to store the last known location.
    @observable
    private _location: MyLocation = noLocation;
    public get location() {
        return this._location;
    }

    // get the path tokens
    public get pathTokens() {
        return this._schema.getPathTokens(this._location);
    }
    public set pathTokens(tokens: string[]) {
        this._pushLocation(this._schema.getLocation(tokens, this.getPermanentArgs()));
    }

    public doesPathTokenMatch(token: string, level: number, exactOnly: boolean): boolean {
        if (token === '' || token === null || token === undefined) {
            // we want to check that the nth token doesn't exist
            return !this.pathTokens[level];
        }
        const matches = this.pathTokens[level] === token;
        if (exactOnly) {
            return matches && !this.pathTokens[level + 1];
        } else {
            return matches;
        }
    }

    // get the search arguments
    public get query() {
        return this._schema.getQuery(this._location);
    }

    @action
    protected _replaceLocation(location: LocationDescriptorObject) {
        this._history.replace(location);
    }

    @action
    protected _pushLocation(location: LocationDescriptorObject) {
        this._history.push(location);
    }

    protected getPermanentArgs() {
        const query: Query = {};
        this._permanentArgs.forEach(arg => {
            if (arg.defined) {
                query[arg.key] = arg.rawValue;
            }
        });
        return query;
    }

    public set query(query: Query) {
        this._pushLocation(this._schema.getLocation(this.pathTokens, query));
    }

    // This is an extension point for reacting to location changes.
    public handleLocationChange(_pathChanged: boolean, _pathTokens: string[], _searchChanged: boolean, _query: Query) {
        //        console.log("Handler: basic");
    }

    // Handler to be called when a location change is detected
    protected onLocationChanged(newLocation: MyLocation) {
        const pathTokens = this._schema.getPathTokens(newLocation);

        const oldQuery = this.query;
        const oldQueryString = JSON.stringify(oldQuery);

        const newQuery = this._schema.getQuery(newLocation);
        const newQueryString = JSON.stringify(newQuery);

        /*
        console.log(
            "*** Location change",
            this.path, oldSearch,
            newPath, newSearch,
        );
        */
        const pathChanged = JSON.stringify(pathTokens) !== JSON.stringify(this.pathTokens);
        const searchChanged = oldQueryString !== newQueryString;

        this.handleLocationChange(pathChanged, pathTokens, searchChanged, newQuery);

        if (debug) {
            console.log('Recording change to', JSON.stringify(newLocation));
        }
        // Update the stored location
        this._location = newLocation;
    }

    // Activate the router
    @action
    public watchHistory() {
        // Set the initial location
        const location = (this._history as any).location;
        this.onLocationChanged(location);

        // Watch for future changes
        this._history.listen((location: MyLocation) => this.onLocationChanged(location));
    }

    protected _getLocationForQueryChanges(changes: QueryChange[]): MyLocation {
        const query = this.query;
        changes.forEach(change => {
            const { key, value } = change;
            if (value === undefined || value === null) {
                delete query[key];
            } else {
                query[key] = value;
            }
        });
        const location = this._schema.getLocation(this.pathTokens, query);
        return location;
    }

    protected _getLocationForQueryChange(key: string, value: string | undefined) {
        return this._getLocationForQueryChanges([
            {
                key,
                value,
            },
        ]);
    }

    public getURLForQueryChanges(changes: QueryChange[]): string {
        const location = this._getLocationForQueryChanges(changes);
        return locationToUrl(location);
    }

    public getURLForQueryChange(key: string, value: string | undefined): string {
        return this.getURLForQueryChanges([
            {
                key,
                value,
            },
        ]);
    }

    @action
    public pushQueryChanges(changes: QueryChange[]) {
        this._pushLocation(this._getLocationForQueryChanges(changes));
    }
    @action
    public replaceQueryChanges(changes: QueryChange[]) {
        this._replaceLocation(this._getLocationForQueryChanges(changes));
    }
    @action
    public pushQueryChange(key: string, value: string | undefined) {
        this.pushQueryChanges([
            {
                key,
                value,
            },
        ]);
    }
    @action
    public replaceQueryChange(key: string, value: string | undefined) {
        this.replaceQueryChanges([
            {
                key,
                value,
            },
        ]);
    }

    public getLocationForPathTokens(position: number, tokens: string[]) {
        const before = this.pathTokens.slice(0, position);
        const newTokens = [...before, ...tokens];
        const query = this.getPermanentArgs();
        const location = this._schema.getLocation(newTokens, query);
        return location;
    }

    public getURLForPathTokens(position: number, tokens: string[]) {
        const location = this.getLocationForPathTokens(position, tokens);
        return locationToUrl(location);
    }
    @action
    public pushPathTokens(position: number, tokens: string[]) {
        const location = this.getLocationForPathTokens(position, tokens);
        this._pushLocation(location);
    }

    public registerUrlArg(arg: UrlArg<any>) {
        this._permanentArgs.push(arg);
    }
}
