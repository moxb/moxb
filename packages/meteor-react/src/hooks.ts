import { useEffect, useState } from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import { getDebugLogger } from '@moxb/moxb';
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
