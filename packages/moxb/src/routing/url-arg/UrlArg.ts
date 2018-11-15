import { UpdateMethod } from '../location-manager/LocationManager';
import { Query } from '../url-schema/UrlSchema';

export interface ParserFunc<T> {
    (formatted: string): T;
}

interface EqualityTester<T> {
    (v1: T, v2: T): boolean;
}

interface FormatterFunc<T> {
    (value: T): string;
}

export interface UrlArgTypeDef<T> {
    getParser: (key: string) => ParserFunc<T>;
    isEqual: EqualityTester<T>;
    format: FormatterFunc<T>;
}

export interface UrlArgDefinition<T> {
    key: string;
    valueType: UrlArgTypeDef<T>;
    parser?: ParserFunc<T>;
    defaultValue: T;
    permanent?: boolean;
}

/**
 * Handler for an URL argument
 */
export interface UrlArg<T> {
    /**
     * Is this argument specified in the current query?
     */
    readonly defined: boolean;

    /**
     * The current value.
     *
     * Can be read or written
     */
    value: T;

    /**
     * Explicitly set the current value.
     *
     * @param value The new value
     * @param method The method for updating the URL (push or replace)
     */
    set(value: T, method?: UpdateMethod): void;

    /**
     * Reset the value to default
     *
     * @param method The method for updating the URL (push or replace)
     */
    reset(method?: UpdateMethod): void;

    /**
     * Get the URL string that would result if we modified the value
     */
    getModifiedUrl(value: T): string;

    // ======= Anything below this level is quite technical,
    // you probably won't need to use it directly.

    /**
     * Extract the value of this arg from a given query
     */
    getOnQuery(query: Query): T;

    /**
     * Get the raw (string) value corresponding to a given value
     */
    getRawValue(value: T): string | undefined;

    /**
     * Get the key
     */
    readonly key: string;

    /**
     * Get the raw form of the value
     */
    readonly rawValue: string;

    /**
     * Get the default value
     */
    readonly defaultValue: T;
}
