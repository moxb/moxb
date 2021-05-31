import { MyLocation, SuccessCallback, UpdateMethod } from '../location-manager';
import { TestLocation } from '../location-manager/LocationManager';

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
 * Handler for an URL argument that can only be read
 */
export interface ReadOnlyArg<T> {
    /**
     * Is this argument specified in the current query?
     */
    readonly defined: boolean;

    /**
     * The current value of the arg
     */
    readonly value: T;

    /**
     * Get the value as it would be if we were at the given test location
     */
    valueOn(location: TestLocation): T;

    /**
     * Get the default value
     */
    readonly defaultValue: T;
}

/**
 * Define an URL argument that can be read, and reset, but not written to directly
 */
export interface ResettableArg<T> extends ReadOnlyArg<T> {
    /**
     * Get the Location that would result if we reset this arg
     *
     * Returns the same value if this arg doesn't care about the URL.
     */
    getResetLocation(start: MyLocation): MyLocation;

    /**
     * Get the URL string that would result if we reset the value
     *
     * Returns undefined if this arg doesn't care about the URL.
     */
    getResetUrl(): string | undefined;

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
}

/**
 * Handler for an URL argument
 */
export interface UrlArg<T> extends ResettableArg<T> {
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
}

/**
 * Information about a planned change in a URL argument
 *
 * Using the definition of the url argument
 */
export interface ArgSet<T> {
    reset?: false;
    arg: UrlArg<T>;
    value: T;
}

export function setArg<T>(arg: UrlArg<T>, value: T): ArgSet<T> {
    return {
        reset: false,
        arg,
        value,
    };
}

/**
 * Information about a planned reset in a URL argument
 *
 * Using the definition of the url argument
 */
export interface ArgReset {
    reset: true;
    arg: ResettableArg<any>;
}

export const resetArg = (arg: ResettableArg<any>): ArgReset => ({
    reset: true,
    arg,
});

/**
 * Information about a planned change in a URL argument
 *
 * Using the definition of the url argument
 */
export type ArgChange<T> = ArgSet<T> | ArgReset;

/**
 * A DerivedArg is a (partially functional) UrlArg based on the value of another UrlArg.
 *
 * When read, the value of the newly defined arg (the "target") will be based
 * on value the underlying arg (the "source"),
 * applying the provided conversion function.
 *
 * When reset, the source arg will be reset.
 *
 * The target can't be written to directly.
 */
class DerivedArg<I, O> implements ResettableArg<O> {
    constructor(protected readonly source: UrlArg<I>, protected readonly sourceToTarget: (value: I) => O) {}

    get defined() {
        return this.source.defined;
    }

    get value() {
        return this.sourceToTarget(this.source.value);
    }

    valueOn(location: TestLocation) {
        return this.sourceToTarget(this.source.valueOn(location));
    }

    get defaultValue() {
        return this.sourceToTarget(this.source.defaultValue);
    }

    getResetLocation(start: MyLocation) {
        return this.source.getResetLocation(start);
    }

    getResetUrl() {
        return this.source.getResetUrl();
    }

    doReset(method?: UpdateMethod) {
        this.source.doReset(method);
    }

    tryReset(method?: UpdateMethod, callback?: SuccessCallback) {
        this.source.tryReset(method, callback);
    }
}

/**
 * Define a (partially functional) UrlArg based on the value of another UrlArg.
 *
 * When read, the value of the newly defined arg (the "target") will be based
 * on value the underlying arg (the "source"),
 * applying the provided conversion function.
 *
 * When reset, the source arg will be reset.
 *
 * The target can't be written to directly.
 */
export function defineDerivedArg<I, O>(source: UrlArg<I>, sourceToTarget: (value: I) => O): ResettableArg<O> {
    return new DerivedArg(source, sourceToTarget);
}

/**
 * A DependantArg is an UrlArg that is dependant on the value of another UrlArg.
 *
 * This is like a DerivedArg, but writeable.
 *
 * When read, the value of the newly defined arg (the "target") will be based
 * on value the underlying arg (the "source"),
 * applying the provided conversion function.
 *
 * When reset, the source arg will be reset.
 *
 * When writing the target art, the provided inverse conversion function will be used,
 * and the source will be written.
 */
class DependantArg<I, O> extends DerivedArg<I, O> implements UrlArg<O> {
    constructor(source: UrlArg<I>, sourceToTarget: (value: I) => O, private readonly targetToSource: (value: O) => I) {
        super(source, sourceToTarget);
    }

    trySet(value: O, method: UpdateMethod, callback: SuccessCallback) {
        const sourceValue = this.targetToSource(value);
        this.source.trySet(sourceValue, method, callback);
    }

    doSet(value: O, method?: UpdateMethod) {
        const sourceValue = this.targetToSource(value);
        this.source.doSet(sourceValue, method);
    }

    getModifiedLocation(start: MyLocation, value: O) {
        const sourceValue = this.targetToSource(value);
        return this.source.getModifiedLocation(start, sourceValue);
    }

    getModifiedUrl(value: O) {
        const sourceValue = this.targetToSource(value);
        return this.source.getModifiedUrl(sourceValue);
    }
}

/**
 * Define a UrlArg dependant on the value of another UrlArg.
 *
 * This is like a derived arg, but writeable.
 *
 * When read, the value of the newly defined arg (the "target") will be based
 * on value the underlying arg (the "source"),
 * applying the provided conversion function.
 *
 * When reset, the source arg will be reset.
 *
 * When writing the target art, the provided inverse conversion function will be used,
 * and the source will be written.
 */
export function defineDependantArg<I, O>(
    source: UrlArg<I>,
    sourceToTarget: (value: I) => O,
    targetToSource: (value: O) => I
): UrlArg<O> {
    return new DependantArg(source, sourceToTarget, targetToSource);
}
