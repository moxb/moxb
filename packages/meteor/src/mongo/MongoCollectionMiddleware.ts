import { Mongo } from 'meteor/mongo';

export interface MiddlewareInsertPayload<T> {
    doc: T;
    callback?: Function;
}

export interface MiddlewareUpdatePayload<T> {
    selector: Mongo.Selector<T> | Mongo.ObjectID | string;
    modifier: Mongo.Modifier<T>;
    options?: { multi?: boolean; upsert?: boolean };
    callback?: Function;
}

export interface MiddlewareUpsertPayload<T> {
    selector: Mongo.Selector<T> | Mongo.ObjectID | string;
    modifier: Mongo.Modifier<T>;
    options?: {
        multi?: boolean;
    };
    callback?: Function;
}

export interface MiddlewareUpsertResult {
    numberAffected?: number;
    insertedId?: string;
}

export interface MiddlewareRemovePayload<T> {
    selector: Mongo.Selector<T> | Mongo.ObjectID | string;
    callback?: Function;
}

export interface MongoCollectionMiddleware<T> {
    onBeforeApplyToCollection?(collection: Mongo.Collection<T>): void;
    onAfterApplyToCollection?(collection: Mongo.Collection<T>): void;
    insert(
        payload: MiddlewareInsertPayload<T>, //
        next: { (payload: MiddlewareInsertPayload<T>): string }
    ): string;
    update(
        payload: MiddlewareUpdatePayload<T>, //
        next: { (payload: MiddlewareUpdatePayload<T>): number }
    ): number;
    upsert(
        payload: MiddlewareUpsertPayload<T>, //
        next: { (payload: MiddlewareUpsertPayload<T>): MiddlewareUpsertResult }
    ): MiddlewareUpsertResult;
    remove(
        payload: MiddlewareRemovePayload<T>, //
        next: { (payload: MiddlewareRemovePayload<T>): number }
    ): number;
}
