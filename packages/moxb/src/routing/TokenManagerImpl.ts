import { action, computed, observable } from 'mobx';
import { LocationManager, SuccessCallback, UpdateMethod } from './location-manager';
import { LocationDependentStateSpaceHandler, LocationDependentStateSpaceHandlerImpl } from './location-state-space';
import { TokenManager, TokenMappings } from './TokenManager';
import { isTokenEmpty } from './tokens';
import { Query } from './url-schema/UrlSchema';

interface LiveTokenMappings<DataType> extends TokenMappings<DataType> {
    states: LocationDependentStateSpaceHandler<any, any, DataType>;
}

export class TokenManagerImpl implements TokenManager {
    private readonly _mappings = observable.map<string, LiveTokenMappings<any>>();

    constructor(private readonly _locationManager: LocationManager) {
        // autorun(() => {
        //     console.log('Tokens now:', this.tokens);
        // });
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
    private get _activeMappings(): LiveTokenMappings<any> | undefined {
        let result: LiveTokenMappings<any> | undefined = undefined;

        Array.from(this._mappings.values()).forEach(mapping => {
            const active = true;
            // console.log("Is mapping '" + mapping.id + "' active?", active);
            if (!active) {
                return;
            }
            if (!result || mapping.parsedTokens > result.parsedTokens) {
                result = mapping;
            }
        });
        // if (result) {
        //     console.log("Using mapping '" + result!.id + "'");
        // } else {
        //     console.log('No valid mappings found');
        // }
        return result;
    }

    @computed
    get tokens() {
        const result: Query = {};
        const allTokens = this._locationManager.pathTokens;
        const mappings = this._activeMappings;
        if (!mappings) {
            console.warn("Can't find any active mappings, not parsing path tokens");
            return result;
        }
        const state = mappings.states.getActiveSubState();
        if (state) {
            const { tokenMapping, totalPathTokens } = state;
            if (!tokenMapping) {
                return result;
            }
            const parsedTokens = mappings.parsedTokens + totalPathTokens.length;
            tokenMapping.forEach((key, index) => {
                result[key] = allTokens[parsedTokens + index];
            });
        }
        return result;
    }

    public doSetToken(key: string, value: string, updateMethod?: UpdateMethod) {
        const mappings = this._activeMappings;
        if (!mappings) {
            console.warn("Can't find any active mappings, not setting any tokens");
            return;
        }
        const state = mappings.states.getActiveSubState();
        if (state) {
            const { tokenMapping, totalPathTokens } = state;
            if (!tokenMapping) {
                console.warn("No mappings for this state, can't set tokens!");
                return;
            }
            const index = tokenMapping.indexOf(key);
            if (index === -1) {
                console.warn('No mapping for found for token ' + key);
                return;
            }
            const parsedTokens = mappings.parsedTokens + totalPathTokens.length;
            const localTokens = this._locationManager.pathTokens.slice(parsedTokens);
            for (let i = 0; i < index; i++) {
                if (isTokenEmpty(localTokens[i])) {
                    console.warn("Previous tokens are missing, can't set" + key);
                    return;
                }
            }
            localTokens[index] = value;
            localTokens.splice(index + 1);
            this._locationManager.doSetPathTokens(parsedTokens, localTokens, updateMethod);
        } else {
            console.warn("Invalid state, can't set tokens!");
            return;
        }
    }

    // tslint:disable-next-line:cyclomatic-complexity
    public trySetToken(key: string, value: string, updateMethod?: UpdateMethod, callback?: SuccessCallback): void {
        const mappings = this._activeMappings;
        if (!mappings) {
            console.warn("Can't find any active mappings, not setting any tokens");
            if (callback) {
                callback(false);
            }
            return;
        }
        const state = mappings.states.getActiveSubState();
        if (state) {
            const { tokenMapping, totalPathTokens } = state;
            if (!tokenMapping) {
                console.warn("No mappings for this state, can't set tokens!");
                if (callback) {
                    callback(false);
                }
                return;
            }
            const index = tokenMapping.indexOf(key);
            if (index === -1) {
                console.warn('No mapping for found for token ' + key);
                if (callback) {
                    callback(false);
                }
                return;
            }
            const parsedTokens = mappings.parsedTokens + totalPathTokens.length;
            const localTokens = this._locationManager.pathTokens.slice(parsedTokens);
            for (let i = 0; i < index; i++) {
                if (isTokenEmpty(localTokens[i])) {
                    console.warn("Previous tokens are missing, can't set" + key);
                    if (callback) {
                        callback(false);
                    }
                    return;
                }
            }
            localTokens[index] = value;
            localTokens.splice(index + 1);
            this._locationManager.trySetPathTokens(parsedTokens, localTokens, updateMethod, callback);
        } else {
            console.warn("Invalid state, can't set tokens!");
            if (callback) {
                callback(false);
            }
            return;
        }
    }

    public getURLForTokenChange(_key: string, _value: string) {
        return 'asd';
        // const state = this._states.getActiveSubState();
        // if (state) {
        //     const { tokenMapping, totalPathTokens } = state;
        //     if (!tokenMapping) {
        //         console.warn("No mappings for this state, can't calculate URL!");
        //         return '';
        //     }
        //     const index = tokenMapping.indexOf(key);
        //     if (index === -1) {
        //         console.warn('No mapping for found for token ' + key);
        //         return '';
        //     }
        //     const parsedTokens = this._parsedTokens + totalPathTokens.length;
        //     const allTokens = this._locationManager.pathTokens;
        //     const localTokens = allTokens.slice(parsedTokens);
        //     for (let i = 0; i < index; i++) {
        //         if (isTokenEmpty(localTokens[i])) {
        //             console.warn("Previous tokens are missing, can't set" + key);
        //             return '';
        //         }
        //     }
        //     localTokens[index] = value;
        //     localTokens.splice(index + 1);
        //     return this._locationManager.getURLForPathTokens(parsedTokens, localTokens);
        // } else {
        //     console.warn("Invalid state, can't calculate URL!");
        //     return '';
        // }
    }
}
