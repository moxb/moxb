import { getDebugLogger } from '../util/debugLog';
import { CachedValue, CachedValueProps } from './CachedValue';

const getTime = (): number => new Date().getTime() / 1000;

export class CachedValueImpl<Output> implements CachedValue<Output> {
    private _failed: any;
    private _value?: Output;
    private _lastTested?: number;

    constructor(private readonly props: CachedValueProps<Output>) {}

    // tslint:disable-next-line:cyclomatic-complexity
    get(forceRefresh = false): Output {
        const { name, debugMode, errorCacheSeconds = 60, normalCacheSeconds = 300, getValue } = this.props;
        const logger = getDebugLogger('CachedValue-' + name, debugMode);
        const error = this._failed;
        if (!forceRefresh && !!this._lastTested && !!error && getTime() - this._lastTested < errorCacheSeconds) {
            // Last time this was run, there was an error, and it's not yet time to try again
            logger.log('Running has failed not too long ago; not retrying...');
            throw error;
        }
        if (
            !forceRefresh &&
            !!this._lastTested &&
            !error &&
            !!this._value &&
            getTime() - this._lastTested < normalCacheSeconds
        ) {
            // Last time this was run, there was no error, and it's not yet time to try again
            logger.log('We have a value from not too long ago; not retrying.');
            return this._value;
        }
        // It's time to try this again
        logger.log('Executing');
        this._lastTested = getTime();
        try {
            this._value = getValue();
            delete this._failed;
            return this._value;
        } catch (newError) {
            this._failed = newError;
            throw newError;
        }
    }
}
