import { createBrowserHistory, History as MyHistory, Location as MyLocation, LocationDescriptorObject } from 'history';
import { action, observable } from 'mobx';
import { doTokenStringsMatch, updateTokenString } from '../tokens';
import { UrlArg } from '../url-arg';
import { NativeUrlSchema } from '../url-schema';
import { Query, UrlSchema } from '../url-schema/UrlSchema';

import { LocationManager, LocationUser, QueryChange, Redirect, TestLocation, UpdateMethod } from './LocationManager';
import { LocationCommunicator } from './LocationCommunicator';
import { BasicLocationCommunicator } from './BasicLocationCommunicator';

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
    communicator?: LocationCommunicator;
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
    protected readonly _communicator: LocationCommunicator;

    protected _setting = false;

    public constructor(props: Props) {
        this._schema = props.urlSchema || new NativeUrlSchema();
        this._history = props.history || createBrowserHistory();
        this._communicator = props.communicator || new BasicLocationCommunicator();
    }

    protected readonly _users: LocationUser[] = [];

    registerUser(user: LocationUser) {
        if (this._users.indexOf(user) === -1) {
            this._users.push(user);
            //            console.log('Added new location user', (user as any)._id);
        } else {
            //            console.log('Not adding user again.');
        }
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
    protected _doSetLocation(location: LocationDescriptorObject, method: UpdateMethod = UpdateMethod.PUSH) {
        this._setting = true;
        switch (method) {
            case UpdateMethod.NONE:
                // We don't really have to touch the URL
                break;
            case UpdateMethod.REPLACE:
                this._history.replace(location);
                break;
            case UpdateMethod.PUSH:
                this._history.push(location);
                break;
            default:
                console.warn('Huh? Unknown URL update method requested:', method);
        }
    }

    /**
     * Try to set the location to a new value.
     *
     * This method may ask for confirmation, it necessary.
     *
     * @param location The new location to set
     * @param method   The method to use for updating the URL
     */
    protected _trySetLocation(location: LocationDescriptorObject, method?: UpdateMethod): Promise<boolean> {
        this._communicator.revokeCurrentQuestion();
        const pathTokens = this._schema.getPathTokens(location);
        const query = this._schema.getQuery(location);

        const testLocation: TestLocation = {
            pathTokens,
            query,
            doPathTokensMatch(
                wantedTokens: string[],
                parsedTokens: number,
                exactOnly: boolean,
                debugMode?: boolean
            ): boolean {
                return doTokenStringsMatch(pathTokens, wantedTokens, parsedTokens, exactOnly, debugMode);
            },
        };
        const problems: string[] = [];
        this._users.forEach(user => problems.push(...user.tryLocation(testLocation)));

        if (problems.length) {
            return new Promise<boolean>(resolve => {
                // console.log('There seem to be some problems:', problems);
                this._communicator.confirmLeave(problems).then(decision => {
                    if (decision) {
                        // console.log('Confirmed, going away');
                        this._doSetLocation(location, method);
                        resolve(true);
                    } else {
                        // console.log('Refused, not going away');
                        resolve(false);
                    }
                });
            });
        } else {
            this._doSetLocation(location, method);
            return Promise.resolve(true);
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

    /**
     * Restore the stored location to the browser URL,
     * @private
     */
    protected _restoreStoredLocation() {
        if (!this._communicator.isActive()) {
            // If another change is under progress, we shouldn't touch the URL
            this._doSetLocation(this._location, UpdateMethod.REPLACE);
        }
    }

    /**
     * React to a location change detected in the browser.
     * @param newLocation
     * @private
     */
    protected _onLocationChanged(newLocation: MyLocation) {
        const pathTokens = this._schema.getPathTokens(newLocation);

        let jumped = false;
        this._redirects.forEach(redirect => {
            if (jumped) {
                return;
            }
            const { condition, fromTokens, root = false, toTokens, copy = false } = redirect;
            if (doTokenStringsMatch(pathTokens, fromTokens, 0, root) && (!condition || condition())) {
                const target = copy ? [...toTokens, ...pathTokens.slice(fromTokens.length)] : toTokens;
                // console.log('Jumping to', target);
                jumped = true;
                if (this._setting) {
                    // We are doing the change, no reason to verify again
                    this._setting = false;
                    this.doSetPathTokens(0, target, UpdateMethod.REPLACE);
                } else {
                    // This change is coming from the browser, thus we need to verify
                    this.trySetPathTokens(0, target, UpdateMethod.REPLACE).then(result => {
                        if (!result) {
                            this._restoreStoredLocation();
                        }
                    });
                }
            }
        });

        if (jumped) {
            return;
        }

        if (debug) {
            console.log('Recording change to', JSON.stringify(newLocation));
        }
        // Update the stored location
        if (this._setting) {
            this._setting = false;
            // We are doing the change, no reason to verify again
            this._location = newLocation;
        } else {
            // This change is coming from the browser, thus we need to verify
            this._trySetLocation(newLocation, UpdateMethod.NONE).then(result => {
                if (result) {
                    // Actually overwrite the stored location
                    this._location = newLocation;
                } else {
                    this._restoreStoredLocation();
                }
            });
        }
    }

    // Activate the router
    @action
    public watchHistory() {
        // Set the initial location
        const location = (this._history as any).location;
        this._onLocationChanged(location);

        // Watch for future changes
        this._history.listen((newLocation: MyLocation) => this._onLocationChanged(newLocation));
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

    protected _getLocationForPathAndQueryChanges(
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
        return location;
    }

    public getURLForPathAndQueryChanges(
        position = 0,
        tokens: string[] | undefined,
        queryChanges: QueryChange[] | undefined
    ) {
        const location = this._getLocationForPathAndQueryChanges(position, tokens, queryChanges);
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
    public doSetQueries(changes: QueryChange[], method?: UpdateMethod) {
        if (!changes.length) {
            // There is nothing to change
            return;
        }
        const location = this._getLocationForQueryChanges(changes);
        this._doSetLocation(location, method);
    }

    public trySetQueries(changes: QueryChange[], method?: UpdateMethod): Promise<boolean> {
        if (!changes.length) {
            // There is nothing to change
            return Promise.resolve(true);
        }
        const location = this._getLocationForQueryChanges(changes);
        return this._trySetLocation(location, method);
    }

    @action
    public doSetQuery(key: string, value: string | undefined, method?: UpdateMethod) {
        this.doSetQueries(
            [
                {
                    key,
                    value,
                },
            ],
            method
        );
    }

    public trySetQuery(key: string, value: string | undefined, method?: UpdateMethod): Promise<boolean> {
        return this.trySetQueries(
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
    public doSetPathTokens(position: number, tokens: string[], method?: UpdateMethod) {
        const location = this.getLocationForPathTokens(position, tokens);
        this._doSetLocation(location, method);
    }

    public trySetPathTokens(position: number, tokens: string[], method?: UpdateMethod): Promise<boolean> {
        const location = this.getLocationForPathTokens(position, tokens);
        return this._trySetLocation(location, method);
    }

    public doAppendPathTokens(tokens: string[], method?: UpdateMethod) {
        this.doSetPathTokens(this.pathTokens.length, tokens, method);
    }

    public doRemovePathTokens(count: number, method?: UpdateMethod) {
        this.doSetPathTokens(this.pathTokens.length - count, [], method);
    }

    public tryAppendPathTokens(tokens: string[], method?: UpdateMethod) {
        return this.trySetPathTokens(this.pathTokens.length, tokens, method);
    }

    public tryRemovePathTokens(count: number, method?: UpdateMethod) {
        return this.trySetPathTokens(this.pathTokens.length - count, [], method);
    }

    public registerUrlArg(arg: UrlArg<any>) {
        this._permanentArgs.push(arg);
    }

    public setRedirect(redirect: Redirect) {
        this._redirects.push(redirect);
    }

    @action
    public doSetPathTokensAndQueries(
        position: number,
        tokens: string[] | undefined,
        queryChanges: QueryChange[] | undefined,
        method?: UpdateMethod
    ) {
        const location = this._getLocationForPathAndQueryChanges(position, tokens, queryChanges);
        this._doSetLocation(location, method);
    }

    @action
    public trySetPathTokensAndQueries(
        position: number,
        tokens: string[] | undefined,
        queryChanges: QueryChange[] | undefined,
        method?: UpdateMethod
    ) {
        const location = this._getLocationForPathAndQueryChanges(position, tokens, queryChanges);
        return this._trySetLocation(location, method);
    }
}
