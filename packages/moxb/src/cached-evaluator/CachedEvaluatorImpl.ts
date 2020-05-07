import { CachedEvaluator, CachedEvaluatorProps } from './CachedEvaluator';
import { getDebugLogger } from '../util/debugLog';

interface ObjectMap<T> {
    [index: string]: T;
}

const getTime = (): number => new Date().getTime() / 1000;

export class CachedEvaluatorImpl<Input, Output> implements CachedEvaluator<Input, Output> {
    private readonly _failed: ObjectMap<any> = {};
    private readonly _value: ObjectMap<Output> = {};
    private readonly _lastTested: ObjectMap<number> = {};

    constructor(private readonly props: CachedEvaluatorProps<Input, Output>) {}

    get(input: Input, forceRefresh = false) {
        const { name, debugMode, getKey, errorCacheSeconds = 60, normalCacheSeconds = 300, getValue } = this.props;
        const logger = getDebugLogger('CachedEvaluator-' + name, debugMode);
        const key = getKey(input);
        const error = this._failed[key];
        if (!forceRefresh && !!error && getTime() - this._lastTested[key] < errorCacheSeconds) {
            // Last time this was run, there was an error, and it's not yet time to try again
            logger.log('Running for', key, 'has failed not too long ago; not retrying...');
            throw error;
        }
        if (!forceRefresh && !error && getTime() - this._lastTested[key] < normalCacheSeconds) {
            // Last time this was run, there was no error, and it's not yet time to try again
            logger.log('We have a value for', key, 'from not too long ago; not retrying.');
            return this._value[key];
        }
        // It's time to try this again
        logger.log('Executing for', input);
        this._lastTested[key] = getTime();
        try {
            this._value[key] = getValue(input);
            delete this._failed[key];
            return this._value[key];
        } catch (newError) {
            this._failed[key] = newError;
            throw newError;
        }
    }
}
