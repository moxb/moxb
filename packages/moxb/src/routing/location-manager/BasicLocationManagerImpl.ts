import { LocationDescriptorObject } from '../location-manager';
import { createBrowserHistory, History as MyHistory } from 'history';
import { action, observable } from 'mobx';
import { doTokenStringsMatch, updateTokenString } from '../tokens';
import {
    UrlArg,
    URLARG_TYPE_BOOLEAN,
    URLARG_TYPE_INTEGER,
    URLARG_TYPE_OBJECT,
    URLARG_TYPE_ORDERED_STRING_ARRAY,
    URLARG_TYPE_STRING,
    URLARG_TYPE_UNORDERED_STRING_ARRAY,
    URLARG_TYPE_OPTIONAL_INTEGER,
    URLARG_TYPE_OPTIONAL_STRING,
    UrlArgImpl,
} from '../url-arg';
import { NativeUrlSchema } from '../url-schema';
import { Query, UrlSchema } from '../url-schema/UrlSchema';
import { BasicLocationCommunicator } from './BasicLocationCommunicator';
import { LocationCommunicator } from './LocationCommunicator';

import {
    MyLocation,
    LocationChangeInterceptor,
    LocationManager,
    QueryChange,
    Redirect,
    SuccessCallback,
    TestLocation,
    UpdateMethod,
} from './LocationManager';
import { CoreLinkProps } from '../linking/CoreLinkProps';
import { NavRef, NavRefCall } from '../navigation-references';

// We are renaming these types so that it's not confused with the builtin
const MyURI = require('urijs');

const debug = false;

export const noLocation: MyLocation = {
    pathname: '',
    search: '',
    hash: '',
};

export interface Props {
    urlSchema?: UrlSchema;
    history?: MyHistory;
    communicator?: LocationCommunicator;
}

export interface LocationToUrlProps {
    protocol: string;
    hostname: string;
    port: string;
}

export const pathAndQueryToLocation = (pathTokens: string[], query: Query, urlSchema?: UrlSchema): MyLocation => {
    const schema = urlSchema || new NativeUrlSchema();
    const location = schema.getLocation(noLocation, pathTokens, query);
    return location;
};

export const locationToUrl = (location: MyLocation = noLocation, props?: LocationToUrlProps | string): string => {
    const uri = props ? new MyURI(props) : new MyURI();
    const newUri = uri
        .path(location.pathname)
        .search(location.search)
        .hash((location as any).hash);
    return newUri.toString();
};

export const urlToLocation = (url: string): MyLocation => {
    const uri = new MyURI(url);
    const result: MyLocation = {
        pathname: uri.path(),
        search: uri.search(),
        hash: uri.hash(),
    };
    return result;
};

export const pathAndQueryToUrl = (
    pathTokens: string[],
    query: Query,
    baseUrl: string,
    urlSchema?: UrlSchema
): string => {
    const location = pathAndQueryToLocation(pathTokens, query, urlSchema);
    const url = locationToUrl(location, baseUrl);
    return url;
};

export class BasicLocationManagerImpl implements LocationManager {
    protected readonly _schema: UrlSchema;

    get urlSchema() {
        return this._schema;
    }

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

    private _getTestLocation(location: MyLocation): TestLocation {
        return {
            pathTokens: this.getPathTokensForLocation(location),
            query: this.getQueryForLocation(location),
        };
    }

    /**
     * This is where we collect who we have to ask before executing a navigation change.
     */
    protected readonly _interceptors: LocationChangeInterceptor[] = [];

    /**
     * Register a new interceptor that we have to talk to before executing a navigation change.
     */
    registerChangeInterceptor(interceptor: LocationChangeInterceptor) {
        const newId = interceptor.getId();
        const index = this._interceptors.findIndex((i) => i.getId() === newId);
        if (index === -1) {
            // We don't want to add anyone twice.
            this._interceptors.push(interceptor);
            // console.log('Added new interceptor', newId);
        } else {
            this._interceptors[index] = interceptor;
            // console.log('Updated interceptor', newId);
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
        return this.getPathTokensForLocation(this._location);
    }

    public getPathTokensForLocation(location: MyLocation) {
        return this._schema.getPathTokens(location);
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
        return this.getQueryForLocation(this._location);
    }

    public getQueryForLocation(location: MyLocation) {
        return this._schema.getQuery(location);
    }

    @action
    doSetLocation(location: LocationDescriptorObject, method: UpdateMethod = UpdateMethod.PUSH) {
        /**
         * Since we are going to modify the URL, we make a note for ourselves, so that
         * when the URL is modified, and we are notified about the change, we should know
         * that we don't have to check this navigation change again, since it has already
         * been "cleared" by us once.
         * (This will be used in the `onLocationChanged()` function.)
         */
        switch (method) {
            case UpdateMethod.NONE:
                // We don't really have to touch the URL.
                // We only wanted a dry-run, to test is this change would be OK.
                break;
            case UpdateMethod.REPLACE:
                this._setting = true;
                this._history.replace(location);
                break;
            case UpdateMethod.PUSH:
                this._setting = true;
                this._history.push(location);
                break;
            default:
                console.warn('Huh? Unknown URL update method requested:', method);
        }
    }

    /**
     * This is where we will collect the questions that must be asked from the user,
     * in order to navigate to a new location
     */
    protected _collectQuestionsFor(testLocation: TestLocation): string[] {
        const questions: string[] = [];
        this._interceptors // Go over all the registered interceptors
            .forEach((interceptor) => questions.push(...interceptor.anyQuestionsFor(testLocation)));
        return questions;
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
    trySetLocation(location: LocationDescriptorObject | undefined, method?: UpdateMethod, callback?: SuccessCallback) {
        if (!location) {
            if (callback) {
                callback(true);
            }
            return;
        }

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
        const questions = this._collectQuestionsFor(testLocation);

        if (questions.length) {
            // It seems that we must some questions to the user first.

            // console.log('There seem to be some questions:', questions);
            this._communicator
                .confirmLeave(questions)
                .then((decision) => {
                    if (decision) {
                        // According to the user's decision, we are OK,
                        // so we can execute the change.
                        this.doSetLocation(location, method);
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
                })
                .catch((reason) => console.error(reason));
        } else {
            // No questions asked, so we can simply execute the change.
            this.doSetLocation(location, method);
            if (callback) {
                callback(true);
            }
        }
    }

    /**
     * Restore the stored location to the browser URL,
     * @private
     */
    protected _restoreStoredLocation() {
        if (!this._communicator.isActive()) {
            // If another change is under progress, we shouldn't touch the URL
            this.doSetLocation(this._location, UpdateMethod.REPLACE);
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
        this._redirects.forEach((redirect) => {
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
                    this.trySetPathTokens(0, target, UpdateMethod.REPLACE, (result) => {
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
            this.trySetLocation(newLocation, UpdateMethod.NONE, (result) => {
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
        this._history.listen((update) => this._onLocationChanged(update.location));
    }

    public getNewLocationForQueryChanges(baseLocation: MyLocation | undefined, changes: QueryChange[]): MyLocation {
        const base = baseLocation || this.location;
        const pathTokens = this._schema.getPathTokens(base);
        const query = this._schema.getQuery(base);
        changes.forEach((change) => {
            const { key, value } = change;
            if (value === undefined || value === null) {
                // tslint:disable-next-line:no-dynamic-delete
                delete query[key];
            } else {
                query[key] = value;
            }
        });

        const location = this._schema.getLocation(base, pathTokens, query);
        return location;
    }

    public getURLForQueryChanges(changes: QueryChange[]): string {
        const location = this.getNewLocationForQueryChanges(undefined, changes);
        return locationToUrl(location);
    }

    public getNewLocationForPathAndQueryChanges(
        baseLocation: MyLocation | undefined,
        position = 0,
        tokens: string[] | undefined,
        queryChanges: QueryChange[] | undefined,
        dropPermanent = false
    ) {
        let location = baseLocation || this._location;
        if (tokens) {
            location = this.getNewLocationForPathTokens(
                baseLocation || this._location,
                position,
                tokens,
                dropPermanent
            );
        }
        if (queryChanges) {
            location = this.getNewLocationForQueryChanges(location, queryChanges);
        }
        return location;
    }

    public getURLForPathAndQueryChanges(
        position = 0,
        tokens: string[] | undefined,
        queryChanges: QueryChange[] | undefined
    ) {
        const location = this.getNewLocationForPathAndQueryChanges(undefined, position, tokens, queryChanges);
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
        const location = this.getNewLocationForQueryChanges(undefined, changes);
        this.doSetLocation(location, method);
    }

    public trySetQueries(changes: QueryChange[], method?: UpdateMethod, callback?: SuccessCallback) {
        if (!changes.length) {
            // There is nothing to change
            return Promise.resolve(true);
        }
        const location = this.getNewLocationForQueryChanges(undefined, changes);
        this.trySetLocation(location, method, callback);
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

    public getNewLocationForPathTokens(
        baseLocation: MyLocation,
        position: number,
        tokens: string[],
        dropPermanent?: boolean
    ): MyLocation {
        // First we back up the values of our permanent URL args
        const backup = this._permanentArgs.map((arg) => arg.valueOn(this._getTestLocation(baseLocation)));

        // Calculate the new string of path tokens
        const oldTokens = this.getPathTokensForLocation(baseLocation);
        const newTokens = updateTokenString(oldTokens, position, tokens);

        // Calculate the new location by overwriting the path tokens and dropping the queries
        const newLocation = this._schema.getLocation(baseLocation, newTokens, {});

        // Re-apply the values of the permanent Url arguments from the backup
        const result = dropPermanent
            ? newLocation
            : this._permanentArgs.reduce(
                  (prevLocation, arg, index) => arg.getModifiedLocation(prevLocation, backup[index]),
                  newLocation
              );

        // Return the created result
        return result;
    }

    public getURLForPathTokens(position: number, tokens: string[]) {
        const location = this.getNewLocationForPathTokens(this._location, position, tokens);
        return locationToUrl(location);
    }
    @action
    public doSetPathTokens(position: number, tokens: string[], method?: UpdateMethod) {
        const location = this.getNewLocationForPathTokens(this._location, position, tokens);
        this.doSetLocation(location, method);
    }

    public trySetPathTokens(position: number, tokens: string[], method?: UpdateMethod, callback?: SuccessCallback) {
        const location = this.getNewLocationForPathTokens(this._location, position, tokens);
        this.trySetLocation(location, method, callback);
    }

    public getNewLocationForAppendedPathTokens(tokens: string[]) {
        return this.getNewLocationForPathTokens(this._location, this.pathTokens.length, tokens);
    }

    public getNewLocationForRemovedPathTokens(count: number) {
        return this.getNewLocationForPathTokens(this._location, this.pathTokens.length - count, []);
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
        const location = this.getNewLocationForPathAndQueryChanges(undefined, position, tokens, queryChanges);
        this.doSetLocation(location, method);
    }

    @action
    public trySetPathTokensAndQueries(
        position: number,
        tokens: string[] | undefined,
        queryChanges: QueryChange[] | undefined,
        method?: UpdateMethod,
        callback?: SuccessCallback
    ) {
        const location = this.getNewLocationForPathAndQueryChanges(undefined, position, tokens, queryChanges);
        this.trySetLocation(location, method, callback);
    }

    public getNewLocationForLinkProps(link: CoreLinkProps, dropPermanent = false): MyLocation {
        const { to, position, appendTokens, removeTokenCount, argChanges, toRef } = link;
        if (toRef) {
            // We have a NavRef. We are going to use that.
            if ((toRef as any).call) {
                // This is a NavRef object, not a call. We are supposed to execute it now.
                const navRef = toRef as NavRef<any>;
                const { location } = navRef.createDirectLink();
                return location;
            } else {
                // This ia a NavRefCall.
                const { navRef, tokens } = toRef as NavRefCall<any>;
                const { location } = navRef.createDirectLink(tokens);
                return location;
            }
        } else {
            // No navRef, so we will use the token-based parameters.
            const startLocation = appendTokens
                ? this.getNewLocationForAppendedPathTokens(appendTokens)
                : removeTokenCount
                ? this.getNewLocationForRemovedPathTokens(removeTokenCount)
                : this.getNewLocationForPathAndQueryChanges(undefined, position, to, undefined, dropPermanent);
            return (argChanges || []).reduce(
                (prevLocation: MyLocation, change) =>
                    change.reset
                        ? change.arg.getResetLocation(prevLocation)
                        : change.arg.getModifiedLocation(prevLocation, change.value),
                startLocation
            );
        }
    }

    defineStringArg<T = string>(
        key: string,
        // @ts-ignore
        defaultValue: T = '',
        permanent = false
    ): UrlArg<T> {
        return new UrlArgImpl<T>(this, {
            key,
            // @ts-ignore
            valueType: URLARG_TYPE_STRING,
            defaultValue,
            permanent,
        });
    }

    defineOptionalStringArg<T = string>(key: string, permanent = false): UrlArg<T | undefined> {
        return new UrlArgImpl<T | undefined>(this, {
            key,
            // @ts-ignore
            valueType: URLARG_TYPE_OPTIONAL_STRING,
            defaultValue: undefined,
            permanent,
        });
    }

    defineBooleanArg(key: string, defaultValue = false, permanent = false): UrlArg<boolean> {
        return new UrlArgImpl<boolean>(this, {
            key,
            valueType: URLARG_TYPE_BOOLEAN,
            defaultValue,
            permanent,
        });
    }

    defineIntegerArg(key: string, defaultValue = 0, permanent = false): UrlArg<number> {
        return new UrlArgImpl<number>(this, {
            key,
            valueType: URLARG_TYPE_INTEGER,
            defaultValue,
            permanent,
        });
    }

    defineOptionalIntegerArg(key: string, permanent = false): UrlArg<number | undefined> {
        return new UrlArgImpl<number | undefined>(this, {
            key,
            valueType: URLARG_TYPE_OPTIONAL_INTEGER,
            defaultValue: undefined,
            permanent,
        });
    }

    defineUnorderedStringArrayArg(key: string, defaultValue: string[] = [], permanent?: boolean): UrlArg<string[]> {
        return new UrlArgImpl<string[]>(this, {
            key,
            valueType: URLARG_TYPE_UNORDERED_STRING_ARRAY,
            defaultValue,
            permanent,
        });
    }

    defineOrderedStringArrayArg(key: string, defaultValue: string[] = [], permanent?: boolean): UrlArg<string[]> {
        return new UrlArgImpl<string[]>(this, {
            key,
            valueType: URLARG_TYPE_ORDERED_STRING_ARRAY,
            defaultValue,
            permanent,
        });
    }

    defineObjectArg<T>(key: string, defaultValue: T | null = null, permanent?: boolean): UrlArg<T | null> {
        return new UrlArgImpl<T | null>(this, {
            key,
            valueType: URLARG_TYPE_OBJECT<T>(),
            defaultValue,
            permanent,
        });
    }
}
