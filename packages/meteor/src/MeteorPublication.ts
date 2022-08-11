import { getDebugLogger } from '@moxb/moxb/dist/util/debugLog';
import type { Mongo } from 'meteor/mongo';

interface SubscribeCallbacks {
    onReady: () => void;
    onStop: (error: any) => void;
}

export interface MeteorPublicationHandle<Input, Document> {
    /**
     * A user-readable identifier (for debugging)
     */
    name: string;

    /**
     * Subscribe to this publication, with a given set of args
     */
    subscribe(args: Input, callbacks?: SubscribeCallbacks): Meteor.SubscriptionHandle;

    /**
     * Try to read the data from this publication.
     *
     * Please note that in order to access to data, first you need to be subscribed.
     */
    find(args: Input): Document[];

    /**
     * Find out if this publication will skip returning any results for a given set if input args
     */
    willSkip(args: Input): boolean;

    /**
     * Get a client cursor for the output of this publication
     *
     * (This is a very technical internal feature, you probably don't it, unless
     * you want to build a low-lever library integrating with this code.)
     */
    getClientCursor(args: Input): Mongo.Cursor<Document, any>;
}

export interface RegisterMeteorPublicationProps<Input, Document> {
    /**
     * What should be the name of this publication?
     */
    name: string;

    /**
     * The collection to search
     */
    collection: Mongo.Collection<Document, Document>;

    /***
     * Code to run inside the Meteor publication method.
     *
     * (Optional)
     */
    prePublish?: (input: Input, userId: string | null, sub: Subscription) => void;

    /**
     * How to derive the search query for Collection.find() from the input args?
     */
    selector: (input: Input, userId?: string | null, sub?: Subscription) => Mongo.Selector<Document>;

    /**
     * Selector for Collection.find() when running on the client side.
     *
     * If not given, the same selector will be used as on the server side.
     */
    clientSelector?: (input: Input) => Mongo.Selector<Document>;

    /**
     * Should we perhaps stop the subscription on some condition of the output?
     *
     * This will be evaluated on the client side.
     */
    skipIf?: (input: Input) => boolean;

    /**
     * Does this public require authorization?
     *
     * If so, please check permissions here.
     * Throw an exception is access should be denies.
     */
    auth?: (input: Input, userId: string | null, sub: Subscription) => void;

    /**
     * Options for Collection.find()
     */
    options?: (input: Input, userId?: string | null, sub?: Subscription) => Mongo.Options<Document>;

    /**
     * Options for Collection.find() when running on the client side.
     *
     * If not given, the same options will be used as on the server side.
     */
    clientOptions?: (input: Input) => Mongo.Options<Document>;

    /**
     * Should we output debug information about using this publication?
     */
    debugMode?: boolean;
}

/**
 * A comfy way to define a Meteor publication
 *
 * This is a wrapper around Meteor.publish(), Meteor.subscribe() and Collection.find().
 * The idea is that you register your publication with this function (in common code),
 * and this makes it easier to use it on the client side.
 *
 * Some advantages compared to upstream tools:
 *  - You don't have to remember (and can't mistype) the name of the publication,
 *    since it's imported as an object
 *  - The input parameters are type-safe. If you forgot to specify a value, you get an error.
 *  - The same filtering is automatically applied on both the server and the client side.
 *    This can be useful when you have multiple subscriptions on the client side,
 *    and the resulting data sets are automatically merged, but you still want to separate them.
 *    In those situations, you have to set up the filtering again on the client side.
 *    This wrapper takes care of that.
 */
export function registerMeteorPublication<Input, Document>(
    params: RegisterMeteorPublicationProps<Input, Document>
): MeteorPublicationHandle<Input, Document> {
    const {
        name,
        collection,
        prePublish,
        selector,
        clientSelector,
        skipIf,
        auth,
        options,
        clientOptions,
        debugMode,
    } = params;
    const logger = getDebugLogger(`publication ${name}`, debugMode);

    const getServerCursor = (args: Input, sub: Subscription) => {
        const currentSelector = selector(args, sub.userId, sub);
        const currentOptions = options ? options(args, sub.userId, sub) : undefined;
        logger.log('Finding with selector', JSON.stringify(currentSelector), 'options', JSON.stringify(currentOptions));
        return collection.find(currentSelector, currentOptions);
    };
    const getClientCursor = (args: Input) => {
        const selectors = clientSelector ? clientSelector(args) : selector(args);
        const cursor = collection.find(
            selectors,
            clientOptions ? clientOptions(args) : options ? options(args) : undefined
        );
        logger.log(
            'filtering with',
            JSON.stringify(selectors),
            'results:',
            cursor.count(),
            'out of',
            collection.find({}).count()
        );
        return cursor;
    };

    if (Meteor.isServer) {
        Meteor.publish(name, function (this, args: Input) {
            try {
                if (auth) {
                    logger.log('Checking auth');
                    auth(args, this.userId, this);
                }
                if (prePublish) {
                    logger.log('Doing pre-publish');
                    prePublish(args, this.userId, this);
                }
                logger.log('Accessing with args:', JSON.stringify(args));
                const cursor = getServerCursor(args, this);
                logger.log('Number of results:', cursor.count());
                return cursor;
            } catch (error: any) {
                logger.log('Exception while subscribing', error.toString());
                this.error(error);
            }
        });
    }

    const shouldSkip = (args: Input) => !!skipIf && skipIf(args);

    const defaultCallbacks = {
        onReady: () => logger.log('Subscription is ready now'),
        onStop: (error: any) => {
            if (error) {
                console.log(`Meteor subscription "${name}" has been stopped: ${error.toString()}`);
            }
        },
    };

    return {
        name,
        subscribe: (args, callbacks = defaultCallbacks): Meteor.SubscriptionHandle => {
            const skip = shouldSkip(args);
            if (skip) {
                logger.log('Skipping subscription');
                return {
                    ready: () => true,
                    stop: () => {
                        // Nothing to stop here
                    },
                };
            } else {
                const subscribeParams: [string, Input, Record<string, any>] = [name, args, callbacks];
                logger.log('Calling Meteor.subscribe', subscribeParams);
                return Meteor.subscribe(...subscribeParams);
            }
        },
        getClientCursor,
        find: (args) => {
            logger.log('Returning data');
            return getClientCursor(args).fetch();
        },
        willSkip: shouldSkip,
    };
}
