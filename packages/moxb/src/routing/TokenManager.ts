import { Path as MyLocation } from 'history';
import { SuccessCallback, UpdateMethod } from './location-manager';
import { StateCondition, StateSpace } from './location-state-space/state-space/StateSpace';
import { Query } from './url-schema/UrlSchema';

/**
 * A TokenMapping is a bunch of information that the Token Manager needs to be aware of, so that
 * in can apply the mappings originating from a given navigational component.
 * Basically it describes the behaviour of one navigation component, by providing it's state space,
 * and it's location in the navigation tree (ie. parsedTokens)
 */
export interface TokenMappings<DataType> {
    id: string;
    subStates: StateSpace<any, any, DataType>;
    parsedTokens: number;
    filterCondition?: StateCondition<DataType>;
}

/**
 * The task of the TokenManager (singleton) is to extract some named tokens
 * from the string of path tokens.
 *
 * In order to do that, it must be aware of the current mappings
 * between path tokens and names.
 */
export interface TokenManager {
    // Maintaining the mappings

    /**
     * Register mappings from a component
     *
     * Navigational components (that want to use token mappings) should call this to register their mappings
     */
    addMappings<DataType>(mappings: TokenMappings<DataType>): string;

    /**
     * De-register mappings
     */
    removeMappings(mappingsId: string): void;

    // Accessing tokens

    /**
     * The current set of tokens, found in the path
     */
    readonly tokens: Query;

    /**
     * Change a token
     *
     * @param key
     * @param value
     * @param updateMethod
     */
    doSetToken(key: string, value: any, updateMethod?: UpdateMethod): void;

    trySetToken(key: string, value: any, updateMethod?: UpdateMethod, callback?: SuccessCallback): void;

    /**
     * Get the current location. (For internal use only.)
     */
    getCurrentLocation(): MyLocation;

    /**
     * Calculate how would the location change, if a given token was to change.
     */
    getLocationForTokenChange(startLocation: MyLocation, key: string, value: any): MyLocation;
}

/**
 * The interface we use when injecting the Location Manager
 */
export interface UsesTokenManager {
    tokenManager?: TokenManager;
}
