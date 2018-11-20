import { TokenManager } from './TokenManager';
import { LocationManager, UpdateMethod } from './location-manager';
import {
    isTokenEmpty,
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    Navigable,
    StateSpace,
} from './index';
import { Query } from './url-schema/UrlSchema';

interface TokenManagerProps<DataType> extends Navigable<any, DataType> {
    locationManager: LocationManager;
    subStates: StateSpace<any, any, DataType>;
}

export class TokenManagerImpl<DataType> implements TokenManager {
    private readonly _states: LocationDependentStateSpaceHandler<any, any, DataType>;
    private readonly _locationManager: LocationManager;
    private readonly _parsedTokens: number;

    constructor(props: TokenManagerProps<DataType>) {
        const { locationManager, subStates, filterCondition, parsedTokens } = props;
        this._locationManager = locationManager;
        this._parsedTokens = parsedTokens || 0;
        this._states = new LocationDependentStateSpaceHandlerImpl({
            id: 'token manager',
            locationManager,
            subStates,
            filterCondition: filterCondition,
            parsedTokens,
        });
    }

    get tokens() {
        const result: Query = {};
        const state = this._states.getActiveSubState();
        if (state) {
            const allTokens = this._locationManager.pathTokens;
            const { tokenMapping, totalPathTokens } = state;
            if (!tokenMapping) {
                return result;
            }
            const parsedTokens = this._parsedTokens + totalPathTokens.length;
            tokenMapping.forEach((key, index) => {
                result[key] = allTokens[parsedTokens + index];
            });
        }
        return result;
    }

    public setToken(key: string, value: string, updateMethod?: UpdateMethod) {
        const state = this._states.getActiveSubState();
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
            const parsedTokens = this._parsedTokens + totalPathTokens.length;
            const localTokens = this._locationManager.pathTokens.slice(parsedTokens);
            for (let i = 0; i < index; i++) {
                if (isTokenEmpty(localTokens[i])) {
                    console.warn("Previous tokens are missing, can't set" + key);
                    return;
                }
            }
            localTokens[index] = value;
            localTokens.splice(index + 1);
            this._locationManager.setPathTokens(parsedTokens, localTokens, updateMethod);
        } else {
            console.warn("Invalid state, can't set tokens!");
            return;
        }
    }

    public getURLForTokenChange(key: string, value: string) {
        const state = this._states.getActiveSubState();
        if (state) {
            const { tokenMapping, totalPathTokens } = state;
            if (!tokenMapping) {
                console.warn("No mappings for this state, can't calculate URL!");
                return '';
            }
            const index = tokenMapping.indexOf(key);
            if (index === -1) {
                console.warn('No mapping for found for token ' + key);
                return '';
            }
            const parsedTokens = this._parsedTokens + totalPathTokens.length;
            const allTokens = this._locationManager.pathTokens;
            const localTokens = allTokens.slice(parsedTokens);
            for (let i = 0; i < index; i++) {
                if (isTokenEmpty(localTokens[i])) {
                    console.warn("Previous tokens are missing, can't set" + key);
                    return '';
                }
            }
            localTokens[index] = value;
            localTokens.splice(index + 1);
            return this._locationManager.getURLForPathTokens(parsedTokens, localTokens);
        } else {
            console.warn("Invalid state, can't calculate URL!");
            return '';
        }
    }
}
