import { Path as MyLocation, To as LocationDescriptorObject } from 'history';

/**
 * A simple Map/Dict type used to represent the URL arguments.
 */
export interface Query {
    [key: string]: string;
}

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
