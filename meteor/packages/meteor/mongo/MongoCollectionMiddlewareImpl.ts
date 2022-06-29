import type { Mongo } from 'meteor/mongo';
import type { MongoCollectionMiddleware } from './MongoCollectionMiddleware';

/**
 * Applies a single middleware to a MongoDB collection instance.
 *
 * This function updates the relevant methods in the collection.
 *
 * This method may be used multiple times on a single collection,
 * method calls will go through each middleware in the *reverse* order they were applied
 * (i.e. the last applied middleware will be used first).
 *
 * @param collection the collection to apply the middleware to, this collections gets monkeypatched with updated behaviour.
 * @param middleware the middleware to apply.
 */
export function applyMiddlewareToCollection<T>(
    collection: Mongo.Collection<T>,
    middleware: MongoCollectionMiddleware<T>
): void {
    if (middleware.onBeforeApplyToCollection) {
        middleware.onBeforeApplyToCollection(collection);
    }

    const doInsert = collection.insert;
    collection.insert = (doc, callback) =>
        middleware.insert({ doc, callback }, (payload) => doInsert.apply(collection, [payload.doc, payload.callback]));
    const doUpsert = collection.upsert;
    collection.upsert = (selector, modifier, options, callback) =>
        middleware.upsert({ selector, modifier, options, callback }, (payload) =>
            doUpsert.apply(collection, [payload.selector, payload.modifier, payload.options, payload.callback])
        );
    const doUpdate = collection.update;
    collection.update = (selector, modifier, options, callback) =>
        middleware.update({ selector, modifier, options, callback }, (payload) =>
            doUpdate.apply(collection, [payload.selector, payload.modifier, payload.options, payload.callback])
        );
    const doRemove = collection.remove;
    collection.remove = (selector, callback) =>
        middleware.remove({ selector, callback }, (payload) =>
            doRemove.apply(collection, [payload.selector, payload.callback])
        );

    if (middleware.onAfterApplyToCollection) {
        middleware.onAfterApplyToCollection(collection);
    }
}
