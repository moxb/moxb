import { observable, computed, action } from 'mobx';

// We are renaming these types so that it's not confused with the builtin
const MyURI = require('urijs');
import {
    Path,
    Location as MyLocation,
    History as MyHistory,
    LocationDescriptorObject,
    createBrowserHistory,
} from 'history';

import { LocationManager, Query } from './LocationManager';

import { UrlArg, URLARG_TYPE_PATH } from './urlArg';

const debug = false;

export const PATH_STRATEGY = {
    NATIVE: 'native',
    QUERY: 'query',
    //    HASH: "hash",
};

export type PathStrategy = typeof PATH_STRATEGY.NATIVE | typeof PATH_STRATEGY.QUERY;
//    typeof PATH_STRATEGY.HASH;

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

const getQueryFromQueryString = (queryString: string, removePath?: boolean): Query => {
    const query = new MyURI().search(queryString).search(true);
    if (removePath) {
        delete query['path'];
    }
    return query;
};

const getQueryFromLocation = (location: MyLocation, removePath?: boolean): Query =>
    getQueryFromQueryString(location.search, removePath);

const getQueryStringFromQuery = (query: Query): string => new MyURI().search(query).search();

export class BasicLocationManagerImpl implements LocationManager {
    protected readonly _pathStrategy: PathStrategy;

    public readonly pathSeparator: string;

    public parsePathTokens(pathname: string): string[] {
        const raw = pathname[0] === this.pathSeparator ? pathname.substr(1) : pathname;
        return raw.split(this.pathSeparator);
    }

    public formatPathTokens(tokens: string[]): string {
        return tokens.join(this.pathSeparator);
    }

    protected readonly _pathArg: UrlArg<Path>;

    public constructor(props: Props) {
        this._pathStrategy = props.pathStrategy || PATH_STRATEGY.NATIVE;
        this.pathSeparator = this._pathStrategy === PATH_STRATEGY.NATIVE ? '/' : '.';
        this._pathArg = new UrlArg(this, {
            key: 'path',
            valueType: URLARG_TYPE_PATH,
            defaultValue: this.pathSeparator,
        });
    }

    // Private field to actually follow the browser history
    private _history: MyHistory = createBrowserHistory();

    // Private field to store the final bit.
    @observable
    private _final: boolean = true;

    // Getters and setters for the final bit
    @computed
    public get final() {
        return this._final;
    }
    public set final(value: boolean) {
        this._final = value;
    }
    @computed
    public get temporary() {
        return !this._final;
    }
    public set temporary(value: boolean) {
        this._final = !value;
    }

    // Private field to store the last known location.
    @observable
    private _location: MyLocation = noLocation;

    // Extension point for extended classes, because for some reason,
    // I can't access the generated getters.
    protected getLocation() {
        return this._location;
    }

    // public getter for location.
    @computed
    public get location() {
        return this._location;
    }

    private _getPathFromLocation(location: MyLocation): string {
        switch (this._pathStrategy) {
            case PATH_STRATEGY.NATIVE:
                return location.pathname;
            case PATH_STRATEGY.QUERY:
                const query = getQueryFromLocation(location);
                return this._pathArg.getOnQuery(query);
        }
        return '';
    }

    // get the path
    @computed
    public get path() {
        return this._getPathFromLocation(this.location);
    }

    // get the path tokens
    @computed
    public get pathTokens() {
        return this.parsePathTokens(this.path);
    }

    public set pathTokens(tokens: string[]) {
        this.path = this.formatPathTokens(tokens);
    }

    // get the search arguments
    @computed
    public get query() {
        return getQueryFromLocation(this.location, true);
    }

    @computed
    public get queryString() {
        return getQueryStringFromQuery(this.query);
    }

    // actions for modifying the location

    @action
    public replaceLocation(location: LocationDescriptorObject) {
        if (debug) {
            console.log('Replacing location', JSON.stringify(location));
        }
        this._history.replace(location);
    }

    @action
    public pushLocation(location: LocationDescriptorObject) {
        if (debug) {
            console.log('pushing location', JSON.stringify(location));
        }
        this._history.push(location);
    }

    @action
    public pushPath(path: Path) {
        if (debug) {
            console.log('pushling path', JSON.stringify(path));
        }
        switch (this._pathStrategy) {
            case PATH_STRATEGY.NATIVE:
                this._history.push(path);
                break;
            case PATH_STRATEGY.QUERY:
                this.query = {};
                this._pathArg.set(path, 'replace');
                break;
        }
    }

    @action
    public replacePath(path: Path) {
        if (debug) {
            console.log('Replacing path', JSON.stringify(path));
        }
        switch (this._pathStrategy) {
            case PATH_STRATEGY.NATIVE:
                this._history.replace(path);
                break;
            case PATH_STRATEGY.QUERY:
                this.query = {};
                this._pathArg.set(path, 'replace');
                break;
        }
    }

    public set path(value: Path) {
        this.pushPath(value);
    }

    public set queryString(value: string) {
        // First, we must calculate the real search string to use
        let realQueryString = value;
        if (this._pathStrategy === PATH_STRATEGY.QUERY) {
            // Mix in the path argument
            const wantedQuery = getQueryFromQueryString(value);
            realQueryString = getQueryStringFromQuery({
                path: this.path,
                ...wantedQuery,
            });
        }
        this.pushLocation({
            ...this.location,
            search: realQueryString,
        });
    }

    public set query(query: Query) {
        this.queryString = getQueryStringFromQuery(query);
    }

    // This is an extension point for reacting to location changes.
    public handleLocationChange(
        pathChanged: boolean,
        path: string,
        pathTokens: string[],
        searchChanged: boolean,
        query: string
    ) {
        //        console.log("Handler: basic");
    }

    // Handler to be called when a location change is detected
    private onLocationChanged(newLocation: MyLocation) {
        const newPath = this._getPathFromLocation(newLocation);
        const pathTokens = this.parsePathTokens(newPath);

        const oldSearch = this.queryString;

        const newQuery = getQueryFromLocation(newLocation, true);
        const newSearch = getQueryStringFromQuery(newQuery);

        /*
        console.log(
            "*** Location change",
            this.path, oldSearch,
            newPath, newSearch,
        );
        */
        const pathChanged = newPath !== this.path;
        const searchChanged = oldSearch !== newSearch;

        this.handleLocationChange(pathChanged, newPath, pathTokens, searchChanged, newSearch);

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

    // Todo: is this reactive?
    public isLinkActive(wanted: string, exactOnly: boolean) {
        const current = this.path + this.queryString;
        if (exactOnly) {
            return current === wanted;
        } else {
            return current.startsWith(wanted);
        }
    }
}
