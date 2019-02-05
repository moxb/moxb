import { UpdateMethod } from './location-manager';
import { StateCondition, StateSpace } from './location-state-space/state-space/StateSpace';
import { Query } from './url-schema/UrlSchema';

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
    addMappings<DataType>(mappings: TokenMappings<DataType>): string;
    removeMappings(mappingsId: string): void;

    // Accessing tokens

    tokens: Query;
    doSetToken(key: string, value: any, updateMethod?: UpdateMethod): void;

    trySetToken(key: string, value: any, updateMethod?: UpdateMethod): Promise<boolean>;

    getURLForTokenChange(key: string, value: any): string;
}

/**
 * The interface we use when injecting the Location Manager
 */
export interface UsesTokenManager {
    tokenManager?: TokenManager;
}
