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

import { UrlArg } from './UrlArg';
import { URLARG_TYPE_PATH } from './UrlArgTypes';
import { UrlArgImpl } from './UrlArgImpl';

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
    cleanSeparatorFromPathEnd?: boolean;
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
    protected readonly isNative : boolean;
    protected readonly isQueryBased : boolean;
    public readonly pathSeparator: string;
    public readonly cleanSeparatorFromPathEnd?: boolean;
    protected readonly _permanentArgs: UrlArg<any>[] = [];

    public parsePathTokens(pathname: string): string[] {
        const raw = pathname[0] === this.pathSeparator ? pathname.substr(1) : pathname;
        return raw.split(this.pathSeparator);
    }

    public formatPathTokens(tokens: string[]): string {
        return (this.isNative ? this.pathSeparator : "") +
            tokens.join(this.pathSeparator);
    }

    protected readonly _pathArg: UrlArg<Path>;

    public constructor(props: Props) {
        this._pathStrategy = props.pathStrategy || PATH_STRATEGY.NATIVE;
        this.isNative = this._pathStrategy === PATH_STRATEGY.NATIVE;
        this.isQueryBased = this._pathStrategy === PATH_STRATEGY.QUERY;
        this.cleanSeparatorFromPathEnd = props.cleanSeparatorFromPathEnd;
        this.pathSeparator = this.isNative ? '/' : '.';
        this._pathArg = new UrlArgImpl(this, {
            key: 'path',
            valueType: URLARG_TYPE_PATH,
            defaultValue: this.cleanSeparatorFromPathEnd ? '' : this.pathSeparator,
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
        if (this.isNative) {
            return location.pathname;
        } else if (this.isQueryBased) {
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

    private getPermanentArgs() {
        const query: Query = {};
        this._permanentArgs.forEach(arg => {
            if (arg.defined) {
                query[arg.key] = arg.rawValue;
            }
        });
        return query;
    }

    @action
    public pushPath(path: Path) {
        let realPath = path;
        if (path.endsWith(this.pathSeparator) && this.cleanSeparatorFromPathEnd) {
            realPath = path.substr(0, path.length - 1);
        }
        if (debug) {
            console.log('pushling path', JSON.stringify(realPath));
        }
        if (this.isNative) {
            this._history.push({
                pathname: realPath,
                search: getQueryStringFromQuery(this.getPermanentArgs()),
            });
        } else if (this.isQueryBased) {
            this.query = this.getPermanentArgs();
            this._pathArg.set(realPath, 'replace');

        }
    }

    @action
    public replacePath(path: Path) {
        let realPath = path;
        if (path.endsWith(this.pathSeparator) && this.cleanSeparatorFromPathEnd) {
            realPath = path.substr(0, path.length - 1);
        }
        if (debug) {
            console.log('Replacing path', JSON.stringify(realPath));
        }
        if (this.isNative) {
            this._history.replace({
                pathname: realPath,
                search: getQueryStringFromQuery(this.getPermanentArgs()),
            });
        } else if (this.isQueryBased) {
            this.query = this.getPermanentArgs();
            this._pathArg.set(realPath, 'replace');
        }
    }

    public set path(value: Path) {
        this.pushPath(value);
    }

    public set queryString(value: string) {
        // First, we must calculate the real search string to use
        let realQueryString = value;
        if (this.isQueryBased) {
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
        _pathChanged: boolean,
        _path: string,
        _pathTokens: string[],
        _searchChanged: boolean,
        _query: string
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

    public isLinkActive(rawWanted: string, exactOnly: boolean) {
        const current = this.path + this.queryString;
        let wanted = rawWanted;
        if (wanted.endsWith(this.pathSeparator) && this.cleanSeparatorFromPathEnd) {
            wanted = wanted.substr(0, wanted.length - 1);
        }
        if (exactOnly) {
            return current === wanted;
        } else {
            return current.startsWith(wanted);
        }
    }

    public doesPathTokenMatch(token: string, level: number, exactOnly: boolean): boolean {
        if (token === "") {
            // we want to check that the nth token doesn't exist
            return !this.pathTokens[level];
        }
        const matches = this.pathTokens[level] === token;
        if (exactOnly) {
            return matches && !this.pathTokens[level + 1]
        } else {
            return matches;
        }
    }

    public getURLForPathTokens(position: number, tokens: string[]) {
        const before = this.pathTokens.slice(0, position);
        const newTokens = [...before, ...tokens];
        const pathName = this.formatPathTokens(newTokens);
        const search = this.getPermanentArgs();
        if (this.isNative) {
            return pathName + getQueryStringFromQuery(search);
        } else if (this.isQueryBased) {
            const realQuery = {
                path: pathName,
                ...search,
            };
            return getQueryStringFromQuery(realQuery);
        } else {
            throw new Error("Schema unsupported");
        }
    }

    public pushPathTokens(position: number, tokens: string[]) {
//        console.log("Pushing path tokens", tokens, "to position", position);
        const before = this.pathTokens.slice(0, position);
        this.pathTokens = [...before, ...tokens];
    }

    public registerUrlArg(arg: UrlArg<any>) {
        this._permanentArgs.push(arg);
    }

}
