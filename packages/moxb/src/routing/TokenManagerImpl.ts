import { action, computed, observable } from 'mobx';
import { MyLocation, LocationManager, SuccessCallback, UpdateMethod } from './location-manager';
import { LocationDependentStateSpaceHandler, LocationDependentStateSpaceHandlerImpl } from './location-state-space';
import { TokenManager, TokenMappings } from './TokenManager';
import { isTokenEmpty } from './tokens';
import { Query } from './url-schema/UrlSchema';
import { UrlArg, URLARG_TYPE_OPTIONAL_STRING, URLARG_TYPE_STRING, UrlTokenImpl } from './url-arg';

interface ComplexPathTokenMappingBase {
    /**
     * The key we need to identify this mapping when trying to access the value
     */
    key: string;

    /**
     * Should this vanish when it is on the default value?
     */
    vanishing: boolean;
}

/**
 * Description if a "vanishing token", it a path token that disappears from the path when on the default value
 */
interface VanishingPathTokenMapping extends ComplexPathTokenMappingBase {
    /**
     * The flag for vanishing
     */
    vanishing: true;

    /**
     * The value that should vanish
     */
    defaultValue: string;

    /**
     * What are the possible values for this token?
     *
     * This is required so that we can recognize that the value we find
     * at the expected offset is in fact not a value of this mapping,
     * but the next one, since this has vanished
     */
    allowedValues: string[];
}

/**
 * Just a wrapper around the usual, non-vanishing path token mapping
 */
interface NonVanishingPathTokenMapping extends ComplexPathTokenMappingBase {
    // key: string;
    vanishing: false;
}

// Some small utility types
type SimplePathTokenMapping = string;
type ComplexPathTokenMapping = VanishingPathTokenMapping | NonVanishingPathTokenMapping;
type AnyPathTokenMapping = SimplePathTokenMapping | ComplexPathTokenMapping;
export type PathTokenMappingList = AnyPathTokenMapping[];

/**
 * A path token mapping scheme that doesn't depend on the app's state space
 *
 * Ie. the same tokens are always mapped to the same path positions.
 */
interface PermanentMapping {
    type: 'permanent';
    tokenMapping: PathTokenMappingList;
}

/**
 * Enriched information about state-space dependent token mappings.
 *
 * The added value (compared to the incoming configuration) is the state space handler
 * dealing with this mapping.
 */
interface LiveTokenMappings<DataType> extends TokenMappings<DataType> {
    type: 'complex';
    states: LocationDependentStateSpaceHandler<any, any, DataType>;
}

interface TokenManagerConfig {
    debug?: true;
}

export const expandPathTokenMapping = (mapping: AnyPathTokenMapping): ComplexPathTokenMapping =>
    typeof mapping === 'string'
        ? {
              // this is the basic form, adding a wrapper
              key: mapping,
              vanishing: false,
          }
        : mapping; // this was already complex to begin with

export class TokenManagerImpl implements TokenManager {
    private readonly _mappingRegistry = observable.map<string, LiveTokenMappings<any> | PermanentMapping>();

    /**
     * Get all the registered token mappings.
     */
    @computed
    private get _mappings(): (LiveTokenMappings<any> | PermanentMapping)[] {
        return Array.from(this._mappingRegistry.values());
    }

    constructor(
        private readonly _locationManager: LocationManager,
        private readonly _config: TokenManagerConfig = {}
    ) {}

    /**
     * A convenience function for defining UrlArg-like objects on top of this token manager
     *
     * When the underlying token is not there, it will report the provided default, or an empty space.
     */
    defineStringArg<T = string>(
        key: string,
        // @ts-ignore
        defaultValue: T = ''
    ): UrlArg<T> {
        return new UrlTokenImpl<T>(this, {
            key,
            // @ts-ignore
            valueType: URLARG_TYPE_STRING,
            defaultValue,
        });
    }

    /**
     * A convenience function for defining UrlArg-like objects on top of this token manager.
     *
     * The the underlying token is not there, it will return undefined.
     */
    defineOptionalStringArg<T = string>(key: string): UrlArg<T | undefined> {
        return new UrlTokenImpl<T | undefined>(this, {
            key,
            // @ts-ignore
            valueType: URLARG_TYPE_OPTIONAL_STRING,
            defaultValue: undefined,
        });
    }

    /**
     * Register some (state-space dependent) token mappings.
     * @param mappings
     */
    @action
    addMappings<DataType>(mappings: TokenMappings<DataType>) {
        const { id, subStates, parsedTokens = 0, filterCondition } = mappings;
        const { debug } = this._config;
        let mappingsId = id;
        while (this._mappingRegistry.get(mappingsId)) {
            mappingsId = mappingsId + '_';
        }
        this._mappingRegistry.set(mappingsId, {
            type: 'complex',
            id,
            subStates,
            parsedTokens,
            filterCondition,
            states: new LocationDependentStateSpaceHandlerImpl({
                id: 'token manager mappings ' + id,
                locationManager: this._locationManager,
                subStates,
                filterCondition,
                parsedTokens,
                debug,
            }),
        });
        // console.log('Added path token mappings', mappingsId);
        return mappingsId;
    }

    /**
     * Register some permanent (ie. state-space independent) token mappings.
     */
    @action
    addPermanentMappings(tokenMapping: PathTokenMappingList) {
        this._mappingRegistry.set('permanent', {
            type: 'permanent',
            tokenMapping,
        });
    }

    @action
    removeMappings(mappingsId: string) {
        // console.log('Removing mappings', mappingsId);
        this._mappingRegistry.delete(mappingsId);
    }

    /**
     * Determine the current value of all the defined tokens, based on the available path tokens
     */
    @computed
    get tokens() {
        const result: Query = {};
        const allTokens = this._locationManager.pathTokens;

        /**
         * To catch all the tokens, we will have to go through all the registered mapping schemes,
         * because more than one might apply.
         */
        this._mappings.forEach((m) => {
            if (m.type === 'permanent') {
                // This is a state-space independent mapping that should always be considered
                let tokenIndex = 0; // Let's start to count the tokens
                m.tokenMapping.forEach((def) => {
                    const nextRawValue = allTokens[tokenIndex]; // This is the next path token we see
                    const token = expandPathTokenMapping(def); // the definition of the next token mapping
                    if (
                        token.vanishing && // This is a vanishing token
                        (isTokenEmpty(nextRawValue) || // Right now it has vanished (from the end of path)
                            token.allowedValues.indexOf(nextRawValue) === -1) // ... or vanished from the middle
                    ) {
                        // We don't accept this value for this mapping, so don't move on with the token counter
                        result[token.key] = token.defaultValue; // since we don't have a value, use the default
                    } else {
                        // Nothing has vanished here, just move on normally
                        result[token.key] = nextRawValue; // copy the value
                        tokenIndex++; // ok we have eaten this path token
                    }
                });
            } else {
                // This is a state-space dependent mapping scheme, so we will have to figure out
                // which sub-state is active.
                const { states, parsedTokens = 0 } = m as LiveTokenMappings<any>;
                const state = states.getActiveSubState();
                if (state) {
                    // We have identified the definition sub-state of the app we need to look at
                    const { tokenMapping, totalPathTokens } = state;
                    if (!tokenMapping) {
                        return; // no mappings for this sub-space, we can ignore this one
                    }
                    // We have eaten this many tokens. (We have already eaten some just by getting to this sub-state)
                    let totalParsedTokens = parsedTokens + totalPathTokens.length;
                    // Now we can move through the individual mappings
                    tokenMapping.forEach((def) => {
                        const nextRawValue = allTokens[totalParsedTokens]; // this is the next token we see on the path
                        const token = expandPathTokenMapping(def); // the next mapping definition
                        if (
                            token.vanishing && // This is a vanishing token and
                            (isTokenEmpty(nextRawValue) || // it has just vanished (from the end)
                                token.allowedValues.indexOf(nextRawValue) === -1) // or the middle of the path
                        ) {
                            // We can refuse to accept this token for this mapping.
                            result[token.key] = token.defaultValue; // we use the default here
                            // we don't increase the token index counter,
                            // so the same token will be used for the next mapping
                        } else {
                            result[token.key] = nextRawValue; // just copy that we found
                            totalParsedTokens++; // we move the counter on
                        }
                    });
                }
            }
        });
        return result;
    }

    /**
     * Update a token on a given mapping.
     *
     * This will be called with all valid mappings.
     */
    // tslint:disable-next-line:cyclomatic-complexity
    private _doSetTokenOnMappings(
        tokenMapping: PathTokenMappingList,
        parsedTokens: number, // We have already eaten this many tokens
        key: string,
        value: string,
        updateMethod?: UpdateMethod
    ) {
        const index = this._findPathToken(tokenMapping, key); // Let's identify the mapping based on the key
        if (index === -1) {
            // console.warn('No mappings for path token', key, 'on the active state of', id, ", can't set token!");
            return;
        }

        // These are the tokens on the current path that we can work with
        const localTokens = this._locationManager.pathTokens.slice(parsedTokens);

        // Let's see if we can reach the wanted mapping
        let tokenIndex = 0; // let's count which element of the current path we are looking at
        for (let i = 0; i < index; i++) {
            // go through the previous mappings
            const nextRawValue = localTokens[tokenIndex]; // this the actual value we see on the path
            const token = expandPathTokenMapping(tokenMapping[i]); // this is the definition of the next mapping
            if (token.vanishing) {
                // this is a vanishing token
                if (token.allowedValues.indexOf(nextRawValue) === -1) {
                    // and it has just vanished
                    // We recognize that this has now vanished, so don't increase the token index counter
                } else {
                    tokenIndex++; // didn't vanish, the value is there. Let's eat it and continue
                }
            } else {
                // not a vanishing token
                if (isTokenEmpty(nextRawValue)) {
                    // if it's missing,
                    // then we can't set the wanted one because the path would be invalid
                    console.warn('Previous token', token.key, "is missing, can't set" + key);
                    return;
                } else {
                    // just a normal token, and it's there
                    tokenIndex++; // ok let's eat eat, and continue to the next one
                }
            }
        }
        // So all the previous tokens are there, we can continue to do the required change

        const editedToken = expandPathTokenMapping(tokenMapping[index]); // let's get the definition of what we want to change
        const currentRawValue = localTokens[tokenIndex]; // the current value on the path
        if (editedToken.vanishing) {
            // This is a vanishing token.
            if (value === editedToken.defaultValue) {
                // we are trying to set the default value, which will vanish,
                // so we should check of the current value is not vanished.
                if (
                    isTokenEmpty(currentRawValue) || // this is missing from the end of the path
                    editedToken.allowedValues.indexOf(currentRawValue) === -1 // vanished in the middle of the path
                ) {
                    // Yes, it has already vanished. So no need to change anything.
                    return;
                }
                // No, currently it's there. So we get rid of it.
                localTokens.splice(tokenIndex);
            } else {
                // We are trying to set a non-default value.
                // We need to check for the exact value here, to avoid useless overwrite
                if (currentRawValue === value) {
                    // Are we trying to set the same?
                    return; // no change, ignore
                }
                // this is a real change, let's execute
                localTokens[tokenIndex] = value;
                localTokens.splice(tokenIndex + 1);
            }
        } else {
            // Normal token, not vanishing
            if (currentRawValue === value) {
                // This is not a change, ignoring
                return;
            }
            // Yes, real change, we must execute
            localTokens[tokenIndex] = value;
            localTokens.splice(tokenIndex + 1);
        }
        // Now we know how the path should be, let's do that
        this._locationManager.doSetPathTokens(parsedTokens, localTokens, updateMethod);
    }

    /**
     * Set a given token.
     */
    public doSetToken(key: string, value: string, updateMethod?: UpdateMethod) {
        // we will go through all registered mappings
        this._mappings.forEach((m) => {
            if (m.type === 'permanent') {
                this._doSetTokenOnMappings(m.tokenMapping, 0, key, value, updateMethod);
            } else {
                const { states, parsedTokens = 0 } = m as LiveTokenMappings<any>;
                const state = states.getActiveSubState();
                if (state) {
                    const { tokenMapping, totalPathTokens } = state;
                    if (!tokenMapping) {
                        // console.warn('No mappings found on the active state of', id, ", can't set tokens!");
                        return;
                    }
                    const newParsedTokens = parsedTokens + totalPathTokens.length;
                    this._doSetTokenOnMappings(tokenMapping, newParsedTokens, key, value, updateMethod);
                } else {
                    // no active state here, which means no token mappings
                    return;
                }
            }
        });
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private _trySetTokenOnMappings(
        tokenMapping: PathTokenMappingList,
        parsedTokens: number, // We have already eaten this many tokens
        key: string,
        value: string,
        updateMethod?: UpdateMethod,
        callback?: SuccessCallback
    ): boolean {
        const index = this._findPathToken(tokenMapping, key); // Let's identify the mapping based on the key
        if (index === -1) {
            // console.warn('No mapping for found for token ' + key);
            if (callback) {
                callback(false);
            }
            return false;
        }

        // These are the tokens on the current path that we can work with
        const localTokens = this._locationManager.pathTokens.slice(parsedTokens);

        // Let's see if we can reach the wanted mapping
        let tokenIndex = 0; // let's count which element of the current path we are looking at
        for (let i = 0; i < index; i++) {
            // go through the previous mappings
            const nextRawValue = localTokens[tokenIndex]; // this the actual value we see on the path
            const token = expandPathTokenMapping(tokenMapping[i]); // this is the definition of the next mapping
            if (token.vanishing) {
                // this is a vanishing token
                if (token.allowedValues.indexOf(nextRawValue) === -1) {
                    // Found vanished token; not increasing token index
                    // We recognize that this has now vanished, so don't increase the token index counter
                } else {
                    tokenIndex++; // no, the value is there. Let's eat it and continue
                }
            } else {
                // Not a vanishing token
                if (isTokenEmpty(localTokens[i])) {
                    // if it's missing,
                    // then we can't set the wanted one because the path would be invalid
                    // console.warn("Previous tokens are missing, can't set" + key);
                    if (callback) {
                        callback(false);
                    }
                    return false;
                } else {
                    // just a normal token, and it's there
                    tokenIndex++; // ok let's eat eat, and continue to the next one
                }
            }
        }
        // So all the previous tokens are there, we can continue to do the required change

        const editedToken = expandPathTokenMapping(tokenMapping[index]); // let's get the definition of what we want to change
        const currentRawValue = localTokens[tokenIndex]; // the current value on the path
        if (editedToken.vanishing) {
            if (value === editedToken.defaultValue) {
                // we are trying to set the default value, which will vanish,
                // so we should check of the current value is not vanished.
                if (
                    isTokenEmpty(currentRawValue) || // this is missing from the end of the path
                    editedToken.allowedValues.indexOf(currentRawValue) === -1 // vanished in the middle of the path
                ) {
                    // Yes, it has already vanished. So no need to change anything.
                    if (callback) {
                        callback(true);
                    }
                    // We need to report success, since we have found the value and it has the wanted value now.
                    return true;
                }
                // No, currently it's there. So we get rid of it.
                localTokens.splice(tokenIndex);
            } else {
                // We are trying to set a non-default value.
                // We need to check for the exact value here, to avoid useless overwrite
                if (currentRawValue === value) {
                    // Are we trying to set the same, so no need to change
                    // report early success
                    if (callback) {
                        // let's report success
                        callback(true);
                    }
                    return true;
                }
                // this is a real change, let's execute
                localTokens[tokenIndex] = value;
                localTokens.splice(tokenIndex + 1);
            }
        } else {
            // Normal token, not vanishing
            if (currentRawValue === value) {
                // Nothing to change here
                // report early success
                if (callback) {
                    // let's report success
                    callback(true);
                }
                return true;
            }
            // Yes, real change, we must execute
            localTokens[tokenIndex] = value;
            localTokens.splice(tokenIndex + 1);
        }
        // Now we know how the path should be, let's do that
        this._locationManager.trySetPathTokens(parsedTokens, localTokens, updateMethod, callback);
        return true;
    }

    /**
     * Set a given token
     */
    // tslint:disable-next-line:cyclomatic-complexity
    public trySetToken(key: string, value: string, updateMethod?: UpdateMethod, callback?: SuccessCallback): void {
        // we will go through all registered mappings
        let found = false; // could we do it?
        this._mappings.forEach((m) => {
            if (m.type === 'permanent') {
                const success = this._trySetTokenOnMappings(m.tokenMapping, 0, key, value, updateMethod, callback);
                found = found || success;
            } else {
                const { states, parsedTokens = 0 } = m as LiveTokenMappings<any>;
                const state = states.getActiveSubState();
                if (state) {
                    const { tokenMapping, totalPathTokens } = state;
                    if (!tokenMapping) {
                        // console.warn("No mappings for this state, can't set tokens!");
                        return;
                    }
                    const newParsedTokens = parsedTokens + totalPathTokens.length;
                    const success = this._trySetTokenOnMappings(
                        tokenMapping,
                        newParsedTokens,
                        key,
                        value,
                        updateMethod,
                        callback
                    );
                    found = found || success;
                } else {
                    // console.warn("Invalid state, can't set tokens!");
                    return;
                }
            }
        });
        if (!found) {
            console.warn("Can't find a valid mapping for token", key, "; can't set token");
            if (callback) {
                callback(false);
            }
        }
    }

    public getCurrentLocation(): MyLocation {
        return this._locationManager.location;
    }

    /**
     * Identify a token mapping from a list based on the key
     */
    private _findPathToken(tokenMappings: PathTokenMappingList, key: string): number {
        let result = -1;
        tokenMappings.forEach((def, i) => {
            const token = expandPathTokenMapping(def);
            if (token.key === key) {
                result = i;
            }
        });
        return result;
    }

    /**
     * Let's try to imagine how would the location change if we changed this single token
     */
    // tslint:disable-next-line:cyclomatic-complexity
    private _getLocationForTokenChangeOnMapping(
        tokenMapping: PathTokenMappingList,
        parsedTokens: number, // We have already eaten this many tokens
        prevLocation: MyLocation,
        key: string,
        value: string
    ): MyLocation {
        const index = this._findPathToken(tokenMapping, key); // Let's identify the mapping based on the key
        if (index === -1) {
            // console.warn('No mapping found for token ' + key);
            return prevLocation;
        }

        // These are the tokens on the current path that we can work with
        const localTokens = this._locationManager.getPathTokensForLocation(prevLocation).slice(parsedTokens);

        // Let's see if we can reach the wanted mapping
        let tokenIndex = 0; // let's count which element of the current path we are looking at
        for (let i = 0; i < index; i++) {
            // go through the previous mappings
            const nextRawValue = localTokens[tokenIndex]; // this the actual value we see on the path
            const token = expandPathTokenMapping(tokenMapping[i]); // this is the definition of the next mapping
            if (token.vanishing) {
                // this is a vanishing token
                if (token.allowedValues.indexOf(nextRawValue) === -1) {
                    // and it has just vanished
                    // We recognize that this has now vanished, so don't increase the token index
                } else {
                    tokenIndex++; // didn't vanish, the value is there. Let's eat it and continue
                }
            } else {
                // not a vanishing token
                if (isTokenEmpty(nextRawValue)) {
                    // if it's missing,
                    // then we can't set the wanted one because the path would be invalid
                    console.warn('Previous token', token.key, "is missing, can't set" + key);
                    return prevLocation;
                } else {
                    // just a normal token, and it's there
                    tokenIndex++; // ok let's eat eat, and continue to the next one
                }
            }
        }
        // So all the previous tokens are there, we can continue to do the required change

        const editedToken = expandPathTokenMapping(tokenMapping[index]); // let's get the definition of what we want to change
        const currentRawValue = localTokens[tokenIndex]; // the current value on the path

        if (editedToken.vanishing) {
            // This is a vanishing token.
            if (value === editedToken.defaultValue) {
                // we are trying to set the default value, which will vanish,
                // so we should check of the current value is not vanished.
                if (
                    isTokenEmpty(currentRawValue) || // this is missing from the end of the path
                    editedToken.allowedValues.indexOf(currentRawValue) === -1 // vanished in the middle of the path
                ) {
                    // Yes, it has already vanished. So no need to change anything.
                    return prevLocation;
                }
                // No, currently it's there. So we get rid of it.
                localTokens.splice(tokenIndex);
            } else {
                // We are trying to set a non-default value.
                // We need to check for the exact value here, to avoid useless overwrite
                if (currentRawValue === value) {
                    // Are we trying to set the same?
                    return prevLocation; // no change, ignore
                }
                // this is a real change, let's execute
                localTokens[tokenIndex] = value;
                localTokens.splice(tokenIndex + 1);
            }
        } else {
            // Normal token, not vanishing
            if (currentRawValue === value) {
                // This is not a change, ignoring
                return prevLocation;
            }
            // Yes, real change, we must execute
            localTokens[tokenIndex] = value;
            localTokens.splice(tokenIndex + 1);
        }
        // Now we know how the path should be, let's find out the now location
        return this._locationManager.getNewLocationForPathAndQueryChanges(
            prevLocation,
            parsedTokens,
            localTokens,
            undefined
        );
    }

    public getLocationForTokenChange(startLocation: MyLocation, key: string, value: string): MyLocation {
        return this._mappings.reduce((prevLocation: MyLocation, mappings) => {
            if (mappings.type === 'permanent') {
                return this._getLocationForTokenChangeOnMapping(mappings.tokenMapping, 0, startLocation, key, value);
            } else {
                const { states, parsedTokens: oldParsedTokens = 0 } = mappings as LiveTokenMappings<any>;
                const state = states.getActiveSubState();
                if (state) {
                    const { tokenMapping, totalPathTokens } = state;
                    if (!tokenMapping) {
                        // console.warn("No mappings for this state, can't set tokens!");
                        return prevLocation;
                    }
                    const parsedTokens = oldParsedTokens + totalPathTokens.length;
                    return this._getLocationForTokenChangeOnMapping(
                        tokenMapping,
                        parsedTokens,
                        prevLocation,
                        key,
                        value
                    );
                } else {
                    // console.warn("Invalid state, can't set tokens!");
                    return prevLocation;
                }
            }
        }, startLocation);
    }
}
