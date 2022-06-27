import { MyLocation, LocationDescriptorObject } from '../location-manager';

/**
 * A simple Map/Dict type used to represent the URL arguments.
 */
export type Query = Record<string, string>;

/***
 * A method for storing path tokens and URL arguments in the URL.
 */
export interface UrlSchema {
    /**
     * Extract the path tokens from a location
     */
    getPathTokens(location: MyLocation | LocationDescriptorObject): string[];

    /**
     * Extract the URL arguments from a location
     */
    getQuery(location: MyLocation | LocationDescriptorObject): Query;

    /**
     * Encode the path tokens and the URL arguments in a given location
     */
    getLocation(location: MyLocation, pathTokens: string[], query: Query): MyLocation;
}
