import { useEffect, useState } from 'react';
import { getDebugLogger } from '@moxb/moxb';

/**
 * Configuration options for the RPC hook
 */
export interface UseAsyncDataOptions {
    /**
     * Can we assume that the same input always produces the same output?
     *
     * If set to true, we will always cache and reuse results.
     */
    stable?: boolean;

    /**
     * Should we provide debug output for each step of the way?
     */
    debugMode?: boolean;

    /**
     * Should we swallow RPC errors, instead of dumping to the console?
     *
     * (My default we dump them to the console, besides returning them.)
     */
    swallowErrors?: boolean;

    /**
     * Should we keep polling the results?
     *
     * If yes, provide the polling frequency (in seconds).
     *
     * Please note that it doesn't make any sense to do this with "stable" calls.
     */
    polling?: number;
}

const resultsCache: Record<string, Record<string, any>> = {};
const promisesCache: Record<string, Record<string, Promise<any>>> = {};

/**
 * React Hook for using data produced by an async method based on some input
 */
export function useAsyncData<Input, Output>(
    /**
     * Name of this async data (for debugging)
     */
    name: string,
    /**
     * The method to use for generating the output from the input
     */
    generate: (input: Input) => Promise<Output>,
    /**
     * The current input.
     */
    args: Input,
    /**
     * Extra data
     */
    options: UseAsyncDataOptions = {}
): [
    boolean, // pending
    string | undefined, // error
    Output | undefined, // result
    () => void // trigger
] {
    const { stable, debugMode, swallowErrors } = options;
    const logger = getDebugLogger(`RPC ${name}`, debugMode);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [result, setResult] = useState<Output | undefined>(undefined);

    if (!resultsCache[name]) {
        resultsCache[name] = {};
    }
    const resultCache = resultsCache[name];

    if (!promisesCache[name]) {
        promisesCache[name] = {};
    }
    const promiseCache = promisesCache[name];

    const argsString = JSON.stringify(args);

    const trigger = () => {
        const cachedResult = stable ? resultCache[argsString] : undefined;
        if (stable) {
            if (cachedResult) {
                logger.log('Not touching any promises, since we have a cached result');
                setResult(cachedResult);
                return;
            } else {
                logger.log('No cached results found.', cachedResult);
            }
        }

        let promise = stable ? promiseCache[argsString] : undefined;
        if (stable) {
            if (promise) {
                logger.log('Found a pending promise, using that.', !!promise);
            } else {
                logger.log('No pending promise found.');
            }
        }
        if (!promise) {
            logger.log('Launching new request with args', args);
            promise = promiseCache[argsString] = generate(args);
            promise.catch((callError) => {
                if (!swallowErrors) {
                    console.log(`Error on ${name}: ${callError.message}`);
                }
                logger.log(callError.error);
            });
        }
        let aborted = false;
        setPending(true);
        setError(undefined);
        promise.then(
            (incomingInfo) => {
                if (aborted) {
                    logger.log('Ignoring incoming stale result');
                    return;
                }
                logger.log('Resolving with result', incomingInfo);
                resultCache[argsString] = incomingInfo;
                setResult(incomingInfo);
                setPending(false);
            },
            (resultError) => {
                if (aborted) {
                    logger.log('Ignoring incoming stale result');
                    return;
                }
                logger.log('Failing request', resultError.message);
                setResult(undefined);
                setError(resultError.reason || resultError.message);
                setPending(false);
            }
        );
        return () => {
            if (pending) {
                logger.log('Marking as stale');
            }
            aborted = true;
        };
    };

    const reTrigger = () => {
        delete resultCache[argsString];
        delete promiseCache[argsString];
        trigger();
    };

    useEffect(trigger, [argsString]);
    return [pending, error, result, reTrigger];
}
