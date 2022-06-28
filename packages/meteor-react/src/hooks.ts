import { useEffect, useState } from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import { getDebugLogger } from '@moxb/moxb';
import { MeteorMethodControl, MeteorPublicationHandle } from '@moxb/meteor';

export function useMeteorUserId() {
    return useTracker(() => Meteor.userId());
}

export function useMeteorUser() {
    return useTracker(() => Meteor.user());
}

export function useMeteorLoggingIn() {
    return useTracker(() => Meteor.loggingIn());
}

export function useMeteorPublication<Input, Output>(
    publication: MeteorPublicationHandle<Input, Output>,
    args: Input,
    useCase: string,
    debugMode?: boolean
): [() => boolean, Output[], string | undefined] {
    const { name, willSkip, getClientCursor } = publication;
    const logger = getDebugLogger('Hook for publication ' + name, debugMode);
    logger.log('Creating state hooks for useCase', useCase);
    const [error, setError] = useState<string | undefined>();
    const skip = willSkip(args);
    const isReady = () =>
        useSubscribe(skip ? undefined : name, args, {
            onReady: () => logger.log('Subscription is ready now'),
            onStop: (stopError: any) => {
                if (stopError) {
                    const errorString = stopError.messsage || stopError.toString();
                    console.log(`Meteor subscription "${name}" has been stopped: ${errorString}`);
                    setError(errorString);
                }
            },
        })() && !error;
    return [
        () => {
            const loading = isReady();
            logger.log('Checking if loading?', skip ? 'We are skipping this.' : '', loading);
            return loading;
        },
        useTracker(() => getClientCursor(args).fetch()),
        // useFind(() => {
        //     logger.log('Asking for cursor for data');
        //     const cursor = getClientCursor(args);
        //     logger.log('Returning cursor for data', cursor.count(), 'records');
        //     return cursor;
        // }),
        error,
    ];
}

/**
 * Configuration options fot the method hook
 */
export interface UseMethodResultOptions {
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
     * Should we swallow Method errors, instead of dumping to the console?
     *
     * (My default we dump them to the console, besides returning them.)
     */
    swallowErrors?: boolean;

    /**
     * Should we keep polling the results?
     *
     * If yes, provide the polling frequency (in seconds).
     *
     * Please note that it doesn't make any sense to do this with "stable" methods.
     */
    polling?: number;
}

const methodResultCache: Record<string, Record<string, any>> = {};
const methodPromiseCache: Record<string, Record<string, Promise<any>>> = {};

export function useMeteorMethodResult<Input, Output>(
    method: MeteorMethodControl<Input, Output>,
    args: Input,
    options: UseMethodResultOptions = {}
): [
    boolean, // pending
    string | undefined, // error
    Output | undefined, // result
    () => void // trigger
] {
    const { name } = method;
    const { stable, debugMode, swallowErrors } = options;
    const logger = getDebugLogger(`method ${method.name}`, debugMode);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [result, setResult] = useState<Output | undefined>(undefined);

    if (!methodResultCache[name]) {
        methodResultCache[name] = {};
    }
    const resultCache = methodResultCache[name];

    if (!methodPromiseCache[name]) {
        methodPromiseCache[name] = {};
    }
    const promiseCache = methodPromiseCache[name];

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
            promise = promiseCache[argsString] = method.callPromise(args);
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
