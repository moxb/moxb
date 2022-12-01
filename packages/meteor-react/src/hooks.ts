import { useState } from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import { getDebugLogger } from '@moxb/util';
import { MeteorPublicationHandle } from '@moxb/meteor';

export function useMeteorUserId() {
    return useTracker(() => Meteor.userId());
}

export function useMeteorUser() {
    return useTracker(() => Meteor.user());
}

export function useMeteorLoggingIn() {
    return useTracker(() => Meteor.loggingIn());
}

/**
 * The data returned by the `useMeteorPublication()` React hook.
 */
export type PublicationHookHandle<Document> = [
    /**
     * Are we loading?
     */
    () => boolean,

    /**
     * The loaded data
     */
    Document[],

    /**
     * Was there an error?
     */
    string | undefined
];

/**
 * A React hook for using data from a Meteor publication
 *
 * It will automatically follow the input args; subscribe, unsubscribe, etc.
 */
export function useMeteorPublication<Input, Document>(
    publication: MeteorPublicationHandle<Input, Document>,
    args: Input,
    useCase: string,
    debugMode?: boolean
): PublicationHookHandle<Document> {
    const { name, willSkip } = publication;
    const logger = getDebugLogger('Hook for publication ' + name, debugMode);
    logger.log('Creating state hooks for useCase', useCase);
    const [error, setError] = useState<string | undefined>();
    const skip = willSkip(args);
    const isLoading = () =>
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
            const loading = isLoading();
            logger.log('Checking if loading?', skip ? 'We are skipping this.' : '', loading);
            return loading;
        },
        useTracker(() => publication.find(args)),
        // useFind(() => {
        //     logger.log('Asking for cursor for data');
        //     const cursor = getClientCursor(args);
        //     logger.log('Returning cursor for data', cursor.count(), 'records');
        //     return cursor;
        // }),
        error,
    ];
}
