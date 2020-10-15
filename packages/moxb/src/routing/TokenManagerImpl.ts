import { Path as MyLocation } from 'history';
import { action, computed, observable } from 'mobx';
import { LocationManager, SuccessCallback, UpdateMethod } from './location-manager';
import { LocationDependentStateSpaceHandler, LocationDependentStateSpaceHandlerImpl } from './location-state-space';
import { TokenManager, TokenMappings } from './TokenManager';
import { isTokenEmpty } from './tokens';
import { Query } from './url-schema/UrlSchema';
import { UrlArg, URLARG_TYPE_OPTIONAL_STRING, URLARG_TYPE_STRING, UrlTokenImpl } from './url-arg';

interface LiveTokenMappings<DataType> extends TokenMappings<DataType> {
    states: LocationDependentStateSpaceHandler<any, any, DataType>;
}

export class TokenManagerImpl implements TokenManager {
    private readonly _mappings = observable.map<string, LiveTokenMappings<any>>();

    constructor(private readonly _locationManager: LocationManager) {}

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

    defineOptionalStringArg<T = string>(key: string): UrlArg<T | undefined> {
        return new UrlTokenImpl<T | undefined>(this, {
            key,
            // @ts-ignore
            valueType: URLARG_TYPE_OPTIONAL_STRING,
            defaultValue: undefined,
        });
    }

    @action
    addMappings<DataType>(mappings: TokenMappings<DataType>) {
        const { id, subStates, parsedTokens = 0, filterCondition } = mappings;
        let mappingsId = id;
        while (this._mappings.get(mappingsId)) {
            mappingsId = mappingsId + '_';
        }
        this._mappings.set(mappingsId, {
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
            }),
        });
        // console.log('Added path token mappings', mappingsId);
        return mappingsId;
    }

    @action
    removeMappings(mappingsId: string) {
        // console.log('Removing mappings', mappingsId);
        this._mappings.delete(mappingsId);
    }

    @computed
    private get _activeMappings(): LiveTokenMappings<any>[] {
        return Array.from(this._mappings.values());
    }

    @computed
    get tokens() {
        const result: Query = {};
        const allTokens = this._locationManager.pathTokens;
        const mappings = this._activeMappings;
        mappings.forEach((m) => {
            const state = m.states.getActiveSubState();
            if (state) {
                const { tokenMapping, totalPathTokens } = state;
                if (!tokenMapping) {
                    return;
                }
                const parsedTokens = m.parsedTokens + totalPathTokens.length;
                tokenMapping.forEach((key, index) => {
                    result[key] = allTokens[parsedTokens + index];
                });
            }
        });
        return result;
    }

    public doSetToken(key: string, value: string, updateMethod?: UpdateMethod) {
        this._activeMappings.forEach(({ states, parsedTokens }) => {
            // console.log('Attempting to set token', key, 'on mapping', id);
            const state = states.getActiveSubState();
            if (state) {
                const { tokenMapping, totalPathTokens } = state;
                if (!tokenMapping) {
                    // console.warn('No mappings found on the active state of', id, ", can't set tokens!");
                    return;
                }
                const index = tokenMapping.indexOf(key);
                if (index === -1) {
                    // console.warn('No mappings for path token', key, 'on the active state of', id, ", can't set token!");
                    return;
                }
                const newParsedTokens = parsedTokens + totalPathTokens.length;
                const localTokens = this._locationManager.pathTokens.slice(newParsedTokens);
                for (let i = 0; i < index; i++) {
                    if (isTokenEmpty(localTokens[i])) {
                        // console.warn(
                        //     "Previous tokens are missing, can't set path token",
                        //     key,
                        //     'based on the mappings in',
                        //     id
                        // );
                        return;
                    }
                }
                localTokens[index] = value;
                // console.log(
                //     'Found! After modifying token',
                //     index + 1,
                //     'new list tokens will be',
                //     localTokens.join('/')
                // );
                localTokens.splice(index + 1);
                this._locationManager.doSetPathTokens(newParsedTokens, localTokens, updateMethod);
            } else {
                // console.warn(
                //     "Can't set token",
                //     key,
                //     'based on mappings',
                //     id,
                //     ', since this nav component seems to be in an invalid state.'
                // );
                return;
            }
        });
    }

    // tslint:disable-next-line:cyclomatic-complexity
    public trySetToken(key: string, value: string, updateMethod?: UpdateMethod, callback?: SuccessCallback): void {
        let found = false;
        // const mappings = this._activeMappings;
        // if (!mappings) {
        //     console.warn("Can't find any active mappings, not setting any tokens");
        //     if (callback) {
        //         callback(false);
        //     }
        //     return;
        // }
        this._activeMappings.forEach(({ states, parsedTokens }) => {
            const state = states.getActiveSubState();
            if (state) {
                const { tokenMapping, totalPathTokens } = state;
                if (!tokenMapping) {
                    // console.warn("No mappings for this state, can't set tokens!");
                    // if (callback) {
                    //     callback(false);
                    // }
                    return;
                }
                const index = tokenMapping.indexOf(key);
                if (index === -1) {
                    // console.warn('No mapping for found for token ' + key);
                    // if (callback) {
                    //     callback(false);
                    // }
                    return;
                }
                const newParsedTokens = parsedTokens + totalPathTokens.length;
                const localTokens = this._locationManager.pathTokens.slice(newParsedTokens);
                for (let i = 0; i < index; i++) {
                    if (isTokenEmpty(localTokens[i])) {
                        // console.warn("Previous tokens are missing, can't set" + key);
                        // if (callback) {
                        //     callback(false);
                        // }
                        return;
                    }
                }
                found = true;
                localTokens[index] = value;
                localTokens.splice(index + 1);
                this._locationManager.trySetPathTokens(newParsedTokens, localTokens, updateMethod, callback);
            } else {
                // console.warn("Invalid state, can't set tokens!");
                // if (callback) {
                //     callback(false);
                // }
                return;
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

    public getLocationForTokenChange(startLocation: MyLocation, key: string, value: string): MyLocation {
        return this._activeMappings.reduce((prevLocation: MyLocation, mappings) => {
            const { states, parsedTokens: oldParsedTokens } = mappings;
            const state = states.getActiveSubState();
            if (state) {
                const { tokenMapping, totalPathTokens } = state;
                if (!tokenMapping) {
                    // console.warn("No mappings for this state, can't set tokens!");
                    return prevLocation;
                }
                const index = tokenMapping.indexOf(key);
                if (index === -1) {
                    // console.warn('No mapping for found for token ' + key);
                    return prevLocation;
                }
                const parsedTokens = oldParsedTokens + totalPathTokens.length;
                const localTokens = this._locationManager.pathTokens.slice(parsedTokens);
                for (let i = 0; i < index; i++) {
                    if (isTokenEmpty(localTokens[i])) {
                        // console.warn("Previous tokens are missing, can't set" + key);
                        return prevLocation;
                    }
                }
                localTokens[index] = value;
                localTokens.splice(index + 1);
                return this._locationManager.getNewLocationForPathAndQueryChanges(
                    prevLocation,
                    parsedTokens,
                    localTokens,
                    undefined
                );
            } else {
                // console.warn("Invalid state, can't set tokens!");
                return prevLocation;
            }
        }, startLocation);
    }
}
