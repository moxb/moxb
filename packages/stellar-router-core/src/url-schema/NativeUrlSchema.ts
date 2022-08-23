const MyURI = require('urijs');
import { MyLocation } from '../location-manager';
import { Query, UrlSchema } from './UrlSchema';

/**
 * Config options for the Native URL Shema
 */
export interface NativeUrlSchemaConfig {
    /**
     * How many path tokens are there in the path leading to our app?
     *
     * Ie. if our app lives at the root of the website, then this is 0, which is the default.
     * If our app lives at /app, then this is one.
     */
    level?: number;
}

/**
 * This is simple URL schema that uses the native path and search feature.
 *
 * This looks nice in the URL, but is only applicable if server-side routing is set up
 * in such a way that will return the app consistently, even if the path is different.
 */
export class NativeUrlSchema implements UrlSchema {
    constructor(private readonly _config: NativeUrlSchemaConfig = {}) {}

    /**
     * Fetch the raw path tokens, without considering the path of the app
     */
    private _getRawPathTokens(location: MyLocation): string[] {
        const pathname = location.pathname;
        const raw = pathname[0] === '/' ? pathname.substr(1) : pathname;
        return raw.split('/').filter((token) => token.length);
    }

    /**
     * Get the current path tokens inside the app
     *
     * To get this, we need to remove the path tokens that lead _to_ the app.
     */
    public getPathTokens(location: MyLocation): string[] {
        const { level = 0 } = this._config;
        return this._getRawPathTokens(location).slice(level);
    }

    public getQuery(location: MyLocation): Query {
        return new MyURI().search(location.search).search(true);
    }

    /**
     * Calculate a new location inside the app
     */
    public getLocation(location: MyLocation, pathTokens: string[], query: Query): MyLocation {
        // First we need to find out the path tokens leading _to_ the app
        const oldPathTokens = this._getRawPathTokens(location);
        const { level = 0 } = this._config;
        const keptTokens = oldPathTokens.slice(0, level);

        // Concatenate the tokens leading to the app, and the new path inside the app
        const newPathTokens = [...keptTokens, ...pathTokens];

        // Calculate the new path string
        const pathname = `/${newPathTokens.join('/')}`;

        // Calculate the new search string
        const search = new MyURI().search(query).search().replaceAll('%2C', ',');

        return {
            ...location,
            pathname,
            search,
        };
    }
}
