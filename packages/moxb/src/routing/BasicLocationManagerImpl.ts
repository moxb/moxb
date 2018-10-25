import { observable, action } from 'mobx';
import { UrlSchema, Query } from './UrlSchema';
import { NativeUrlSchema } from './NativeUrlSchema';
import { UrlArg } from './UrlArg';

// We are renaming these types so that it's not confused with the builtin
const MyURI = require('urijs');
import { Location as MyLocation, History as MyHistory, LocationDescriptorObject, createBrowserHistory } from 'history';

import { LocationManager, UpdateMethod, QueryChange } from './LocationManager';

const debug = false;

const noLocation: MyLocation = {
    pathname: '',
    search: '',
    state: null,
    hash: '',
    key: '',
};

export interface Props {
    urlSchema?: UrlSchema;
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
        this._schema = props.urlSchema || new NativeUrlSchema();
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
    protected _location: MyLocation = noLocation;
    public get location() {
        return this._location;
    }

    // get the path tokens
    public get pathTokens() {
        return this._schema.getPathTokens(this._location);
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
    protected _setLocation(location: LocationDescriptorObject, method?: UpdateMethod) {
        if (method === 'replace') {
            this._history.replace(location);
        } else {
            this._history.push(location);
        }
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

    // This is an extension point for reacting to location changes.
    protected handleLocationChange(
        _pathChanged: boolean,
        _pathTokens: string[],
        _searchChanged: boolean,
        _query: Query
    ) {
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
        const location = this._schema.getLocation(this._location, this.pathTokens, query);
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
    public setQueries(changes: QueryChange[], method?: UpdateMethod) {
        const location = this._getLocationForQueryChanges(changes);
        this._setLocation(location, method);
    }
    @action
    public setQuery(key: string, value: string | undefined, method?: UpdateMethod) {
        this.setQueries(
            [
                {
                    key,
                    value,
                },
            ],
            method
        );
    }

    public getLocationForPathTokens(position: number, tokens: string[]) {
        const before = this.pathTokens.slice(0, position);
        const newTokens = [...before, ...tokens];
        const query = this.getPermanentArgs();
        const location = this._schema.getLocation(this._location, newTokens, query);
        return location;
    }

    public getURLForPathTokens(position: number, tokens: string[]) {
        const location = this.getLocationForPathTokens(position, tokens);
        return locationToUrl(location);
    }
    @action
    public setPathTokens(position: number, tokens: string[], method?: UpdateMethod) {
        const location = this.getLocationForPathTokens(position, tokens);
        this._setLocation(location, method);
    }

    public registerUrlArg(arg: UrlArg<any>) {
        this._permanentArgs.push(arg);
    }
}
