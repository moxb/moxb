import { createBrowserHistory, History as MyHistory, Location as MyLocation, LocationDescriptorObject } from 'history';
import { action, observable } from 'mobx';
import { doTokenStringsMatch, updateTokenString } from '../tokens';
import { UrlArg } from '../url-arg';
import { NativeUrlSchema } from '../url-schema';
import { Query, UrlSchema } from '../url-schema/UrlSchema';

import {
    LocationChangeInterceptor,
    LocationManager,
    QueryChange,
    Redirect,
    SuccessCallback,
    TestLocation,
    UpdateMethod,
} from './LocationManager';
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

    // Have we just modified the URL ourselves?
    protected _setting = false;

    public constructor(props: Props) {
        this._schema = props.urlSchema || new NativeUrlSchema();
        this._history = props.history || createBrowserHistory();
        this._communicator = props.communicator || new BasicLocationCommunicator();
    }

    /**
     * This is where we collect who we have to ask before executing a navigation change.
     */
    protected readonly _interceptors: LocationChangeInterceptor[] = [];

    /**
     * Register a new interceptor that we have to talk to before executing a navigation change.
     */
    registerChangeInterceptor(interceptor: LocationChangeInterceptor) {
        if (this._interceptors.indexOf(interceptor) === -1) {
            // We don't want to add anyone twice.
            this._interceptors.push(interceptor);
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
        /**
         * Since we are going to modify the URL, we make a note for ourselves, so that
         * when the URL is modified, and we are notified about the change, we should know
         * that we don't have to check this navigation change again, since it has already
         * been "cleared" by us once.
         * (This will be used in the `onLocationChanged()` function.)
         */
        this._setting = true;
        switch (method) {
            case UpdateMethod.NONE:
                // We don't really have to touch the URL.
                // We only wanted a dry-run, to test is this change would be OK.
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
     * @param callback Callback to call with the result status
     */
    protected _trySetLocation(location: LocationDescriptorObject, method?: UpdateMethod, callback?: SuccessCallback) {
        // If we tried to do something else previously, now we want something else,
        // so the previous question (if any) is no longer relevant.
        this._communicator.revokeCurrentQuestion();

        const pathTokens = this._schema.getPathTokens(location);
        const query = this._schema.getQuery(location);

        /**
         * Here we compile the object that will contain all the information about the wanted location.
         * We will pass this object on to change interceptors, who might want to ask questions to the user.
         * This object mocks a subset of the `LocationManager` API.
         */
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

        // This is where we will collect the questions that must be asked from the user.
        const questions: string[] = [];
        this._interceptors // Go over all the registered interceptors
            .forEach(interceptor => questions.push(...interceptor.anyQuestionsFor(testLocation)));

        if (questions.length) {
            // It seems that we must some questions to the user first.

            // console.log('There seem to be some questions:', questions);
            this._communicator.confirmLeave(questions).then(decision => {
                if (decision) {
                    // According to the user's decision, we are OK,
                    // so we can execute the change.
                    this._doSetLocation(location, method);
                    if (callback) {
                        callback(true);
                    }
                } else {
                    // The user has refused,
                    // so we are not going anywhere.
                    if (callback) {
                        callback(false);
                    }
                }
            });
        } else {
            // No questions asked, so we can simply execute the change.
            this._doSetLocation(location, method);
            if (callback) {
                callback(true);
            }
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
     * Internal method to react to a location change detected in the browser.
     */
    protected _onLocationChanged(newLocation: MyLocation) {
        const pathTokens = this._schema.getPathTokens(newLocation);

        /**
         * First we will check whether or not one of the registered
         * redirects would be triggered by this change,
         * because in that case, we want to do something completely different.
         */
        let jumped = false;
        this._redirects.forEach(redirect => {
            if (jumped) {
                return;
            }
            const { condition, fromTokens, root = false, toTokens, copy = false } = redirect;
            if (doTokenStringsMatch(pathTokens, fromTokens, 0, root) && (!condition || condition())) {
                // We have found a match! This redirect would be triggered

                // Now let's see where we would go to....
                const target = copy ? [...toTokens, ...pathTokens.slice(fromTokens.length)] : toTokens;
                // console.log('Jumping to', target);

                jumped = true; // We are setting this flag a reminder for ourselves.

                if (this._setting) {
                    // We are doing the URL change, so no reason to verify it again
                    this._setting = false; // Reset the flag, not that we have used it.
                    // We can execute the change right away.
                    this.doSetPathTokens(0, target, UpdateMethod.REPLACE);
                } else {
                    // This change is really coming from the browser, thus we need to verify
                    this.trySetPathTokens(0, target, UpdateMethod.REPLACE, result => {
                        if (!result) {
                            this._restoreStoredLocation();
                        }
                    });
                }
            }
        });

        if (jumped) {
            // We have hit one of the redirects, so no further processing necessary.
            return;
        }

        // No redirect is involved, therefore we are supposed go to the exact
        // location described by the URL.
        if (debug) {
            console.log('Recording change to', JSON.stringify(newLocation));
        }

        if (this._setting) {
            // Is this a change triggered by our code?
            this._setting = false; // Reset the flag, not that we have used it.
            // We are doing the change, no reason to verify it again.
            // We can just update the stored location, and everything is OK.
            this._location = newLocation;
        } else {
            // This change is coming from the browser, thus we need to verify
            this._trySetLocation(newLocation, UpdateMethod.NONE, result => {
                if (result) {
                    // Actually update the stored location
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

    public trySetQueries(changes: QueryChange[], method?: UpdateMethod, callback?: SuccessCallback) {
        if (!changes.length) {
            // There is nothing to change
            return Promise.resolve(true);
        }
        const location = this._getLocationForQueryChanges(changes);
        this._trySetLocation(location, method, callback);
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

    public trySetQuery(
        key: string,
        value: string | undefined,
        method?: UpdateMethod,
        callback?: SuccessCallback
    ): void {
        this.trySetQueries(
            [
                {
                    key,
                    value,
                },
            ],
            method,
            callback
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

    public trySetPathTokens(position: number, tokens: string[], method?: UpdateMethod, callback?: SuccessCallback) {
        const location = this.getLocationForPathTokens(position, tokens);
        this._trySetLocation(location, method, callback);
    }

    public doAppendPathTokens(tokens: string[], method?: UpdateMethod) {
        this.doSetPathTokens(this.pathTokens.length, tokens, method);
    }

    public doRemovePathTokens(count: number, method?: UpdateMethod) {
        this.doSetPathTokens(this.pathTokens.length - count, [], method);
    }

    public tryAppendPathTokens(tokens: string[], method?: UpdateMethod, callback?: SuccessCallback) {
        this.trySetPathTokens(this.pathTokens.length, tokens, method, callback);
    }

    public tryRemovePathTokens(count: number, method?: UpdateMethod, callback?: SuccessCallback) {
        this.trySetPathTokens(this.pathTokens.length - count, [], method, callback);
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
        method?: UpdateMethod,
        callback?: SuccessCallback
    ) {
        const location = this._getLocationForPathAndQueryChanges(position, tokens, queryChanges);
        this._trySetLocation(location, method, callback);
    }
}
