import { getDebugLogger } from '../util/debugLog';
import { CachedOptionalValue, CachedOptionalValueProps } from './CachedOptionalValue';

const getTime = (): number => new Date().getTime() / 1000;

export class CachedOptionalValueImpl<Output> implements CachedOptionalValue<Output> {
    private _value?: Output;
    private _lastTested?: number;

    constructor(private readonly props: CachedOptionalValueProps<Output>) {}

    // eslint-disable-next-line complexity
    get(forceRefresh = false): Output | undefined {
        const { name, debugMode, errorCacheSeconds = 60, normalCacheSeconds = 300, getValue } = this.props;
        const logger = getDebugLogger('CacheOptionalValue-' + name, debugMode);
        const failed = this._value === undefined;
        if (!forceRefresh && !!this._lastTested && failed && getTime() - this._lastTested < errorCacheSeconds) {
            // Last time this was run, there was an error, and it's not
            logger.log('Running has failed not too long ago; not retrying...');
            return undefined;
        }
        if (!forceRefresh && !!this._lastTested && !failed && getTime() - this._lastTested < normalCacheSeconds) {
            // Last time this was run, there was no error, and it's not yet time to try again
            logger.log('We have a value from not too long ago; not retrying.');
            return this._value;
        }
        // It's time to try this again
        logger.log('Executing');
        this._lastTested = getTime();
        return (this._value = getValue());
    }
}
