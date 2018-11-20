import { Query } from './url-schema/UrlSchema';
import { UpdateMethod } from './location-manager';

export interface TokenManager {
    tokens: Query;
    setToken(key: string, value: any, updateMethod?: UpdateMethod): void;

    getURLForTokenChange(key: string, value: any): string;
}
