import { SuccessCallback, UpdateMethod } from '../location-manager';
import { TestLocation } from '../location-manager/LocationManager';
import { Location as MyLocation } from 'history';

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

export interface ArgDefinition<T> {
    valueType: UrlArgTypeDef<T>;
    parser?: ParserFunc<T>;
    defaultValue: T;
}

export interface UrlArgDefinition<T> extends ArgDefinition<T> {
    key: string;
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
    readonly value: T;

    /**
     * Get the value as it would be if we were at the given test location
     */
    valueOn(location: TestLocation): T;

    /**
     * Explicitly set the current value.
     *
     * @param value The new value
     * @param method The method for updating the URL (push or replace)
     */
    doSet(value: T, method?: UpdateMethod): void;

    /**
     * Explicitly try to set the current value.
     *
     * @param value The new value
     * @param method The method for updating the URL (push or replace)
     * @param callback Callback to call with the result status
     */
    trySet(value: T, method?: UpdateMethod, callback?: SuccessCallback): void;

    /**
     * Reset the value to default
     *
     * @param method The method for updating the URL (push or replace)
     */
    doReset(method?: UpdateMethod): void;

    /**
     * Reset the value to default
     *
     * @param method The method for updating the URL (push or replace)
     * @param callback Callback to call with the result status
     */
    tryReset(method?: UpdateMethod, callback?: SuccessCallback): void;

    /**
     * Get the Location that would result if we modified the value
     *
     * Returns the same value if this arg doesn't care about the URL.
     */
    getModifiedLocation(start: MyLocation, value: T): MyLocation;

    /**
     * Get the URL string that would result if we modified the value
     *
     * Returns undefined if this arg doesn't care about the URL.
     */
    getModifiedUrl(value: T): string | undefined;

    // ======= Anything below this level is quite technical,
    // you probably won't need to use it directly.

    /**
     * Get the raw (string) value corresponding to a given value
     */
    getRawValue(value: T): string | undefined;

    /**
     * Get the raw form of the value
     */
    readonly rawValue: string | undefined;

    /**
     * Get the default value
     */
    readonly defaultValue: T;
}

/**
 * Information about a planned change in a URL argument
 *
 * Using the definition of the url argument
 */
export interface ArgChange<T> {
    arg: UrlArg<T>;
    value: T;
}
