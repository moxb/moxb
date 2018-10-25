import { UpdateMethod } from './LocationManager';
import { Query } from './UrlSchema';

export interface ParserFunc<T> {
    (formatted: string, defaultValue: T): T;
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

export interface UrlArg<T> {
    // Is this argument specified in the current query?
    readonly defined: boolean;

    // The current value. Can be read or written
    value: T;

    // Explicitely set the current value.
    // Can also specify the method (push or replace)
    set(value: T, method?: UpdateMethod): void;

    // Reset the value to default
    reset(method?: UpdateMethod): void;

    // ======= Anything below this level is quite technical,
    // you probably won't need to use it directly.

    // Extract the value of this arg from a given query
    getOnQuery(query: Query): T;

    // Get the raw (string) value corresponding to a given value
    getRawValue(value: T): string | undefined;

    // Get the URL string that would result if we modified the value
    getModifiedUrl(value: T): string;

    // Get the key
    readonly key: string;

    // Get the raw form of the value
    readonly rawValue: string;
}
