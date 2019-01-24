import {createBrowserHistory, History as MyHistory, Location as MyLocation, LocationDescriptorObject} from 'history';
import {action, observable} from 'mobx';
import {doTokenStringsMatch, updateTokenString} from '../tokens';
import {UrlArg} from '../url-arg';
import {NativeUrlSchema} from '../url-schema';
import {Query, UrlSchema} from '../url-schema/UrlSchema';

import {LocationManager, QueryChange, Redirect, UpdateMethod} from './LocationManager';

// We are renaming these types so that it's not confused with the builtin
const MyURI = require('urijs');

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
    history?: MyHistory;
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
    protected readonly _history: MyHistory;
    protected readonly _redirects: Redirect[] = [];

    public constructor(props: Props) {
        this._schema = props.urlSchema || new NativeUrlSchema();
        this._history = props.history || createBrowserHistory();
    }

    // Private field to store the final bit.
    @observable
    private _final = true;
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

    public doPathTokensMatch(
        wantedTokens: string[],
        parsedTokens: number,
        exactOnly: boolean,
        debugMode?: boolean
    ): boolean {
        return doTokenStringsMatch(this.pathTokens, wantedTokens, parsedTokens, exactOnly, debugMode);
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
                query[arg.key] = arg.rawValue!;
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

        let jumped = false;
        this._redirects.forEach(redirect => {
            if (jumped) {
                return;
            }
            const { condition, fromTokens, root = false, toTokens, updateMethod, copy = false } = redirect;
            if (doTokenStringsMatch(pathTokens, fromTokens, 0, root) && (!condition || condition())) {
                const target = copy ? [...toTokens, ...pathTokens.slice(fromTokens.length)] : toTokens;
                // console.log('Jumping to', target);
                jumped = true;
                this.setPathTokens(0, target, updateMethod);
            }
        });

        if (jumped) {
            return;
        }
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
        this._history.listen((newLocation: MyLocation) => this.onLocationChanged(newLocation));
    }

    protected _getLocationForQueryChanges(changes: QueryChange[], baseLocation?: MyLocation): MyLocation {
        const query = this.query;
        changes.forEach(change => {
            const { key, value } = change;
            if (value === undefined || value === null) {
                // tslint:disable-next-line:no-dynamic-delete
                delete query[key];
            } else {
                query[key] = value;
            }
        });
        const base = baseLocation || this.location;
        const pathTokens = this._schema.getPathTokens(base);
        const location = this._schema.getLocation(base, pathTokens, query);
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

    public getURLForPathAndQueryChanges(
        position = 0,
        tokens: string[] | undefined,
        queryChanges: QueryChange[] | undefined
    ) {
        let location = this._location;
        if (tokens) {
            location = this.getLocationForPathTokens(position, tokens);
        }
        if (queryChanges) {
            location = this._getLocationForQueryChanges(queryChanges, location);
        }
        const url = locationToUrl(location);
        return url;
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
        if (!changes.length) {
            // There is nothing to change
            return;
        }
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
        const newTokens = updateTokenString(this.pathTokens, position, tokens);
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

    public appendPathTokens(tokens: string[], method?: UpdateMethod) {
        this.setPathTokens(this.pathTokens.length, tokens, method);
    }

    public removePathTokens(count: number, method?: UpdateMethod) {
        this.setPathTokens(this.pathTokens.length - count, [], method);
    }

    public registerUrlArg(arg: UrlArg<any>) {
        this._permanentArgs.push(arg);
    }

    public setRedirect(redirect: Redirect) {
        this._redirects.push(redirect);
    }
}
