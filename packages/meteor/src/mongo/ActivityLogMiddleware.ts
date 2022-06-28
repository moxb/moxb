import type { Mongo } from 'meteor/mongo';
import { v4 as uuidv4 } from 'uuid';
import { getIn, setIn } from '../utils';
import {
    MiddlewareInsertPayload,
    MiddlewareRemovePayload,
    MiddlewareUpdatePayload,
    MiddlewareUpsertPayload,
    MiddlewareUpsertResult,
    MongoCollectionMiddleware,
    OptionalId,
} from './MongoCollectionMiddleware';

export type ActivityLogOperation = 'activityOpCreate' | 'activityOpUpdate' | 'activityOpDelete';
export type ActivityLogFieldOperation = 'activityFieldOpCreate' | 'activityFieldOpUpdate' | 'activityFieldOpDelete';

export interface ActivityLog {
    type: string;
    /** The operation on the document. */
    operation: ActivityLogOperation;
    /** The operation on the field itself. */
    fieldOperation: ActivityLogFieldOperation;
    /** The id of the document that was updated. */
    documentId: string;
    /** The name of the field that was tracked and got updated, e.g. "job.status". */
    fieldName: string;
    /** Timestamp of the change. */
    timestamp: Date;
    /** The user who did the change, if any. */
    userInfo?: any;
    /** The new value of the updated field. */
    value: any;
    /** The id of the change that generated this log, multiple logs may have the same changeId if multiple tracked fields where updated at the same time. */
    operationId: string;
}

export type NestedKeyOf<T> = {
    [K in keyof Partial<T>]: NestedKeyOf<Partial<T[K]>> | true;
};

interface StringMap<T> {
    [key: string]: T;
}

function getFieldOperation(valueBefore: any, valueAfter: any): ActivityLogFieldOperation | null {
    if (valueBefore === valueAfter) {
        return null;
    }
    if (valueBefore === undefined) {
        return 'activityFieldOpCreate';
    }
    if (valueAfter === undefined) {
        return 'activityFieldOpDelete';
    }
    return 'activityFieldOpUpdate';
}

function getActivityLogs(
    documentsBefore: FetchedValue[],
    documentsAfter: FetchedValue[],
    trackedFields: string[]
): InternalLog[] {
    const result: InternalLog[] = [];
    documentsAfter.forEach(({ _id }, i) => {
        trackedFields.forEach((fieldName) => {
            const value = getIn(documentsAfter[i], fieldName);
            const valueBefore = getIn(documentsBefore[i], fieldName);
            const fieldOperation = getFieldOperation(valueBefore, value);

            if (fieldOperation) {
                result.push({
                    documentId: _id,
                    operation: 'activityOpUpdate',
                    fieldOperation,
                    fieldName,
                    value,
                });
            }
        });
    });

    return result;
}

function isUpdateRelevantForTrackedFields(modifier: any, trackedFields: StringMap<boolean>): boolean {
    for (const key of Object.keys(modifier)) {
        if (key.startsWith('$')) {
            // e.g. { $set: { 'job.status': 'done' } }
            for (const field of Object.keys(modifier[key])) {
                if (trackedFields[field]) {
                    return true;
                }
            }
        } else if (trackedFields[key]) {
            return true;
        }
    }

    return false;
}

function getFieldPath(prefix: string, key: string) {
    return prefix ? `${prefix}.${key}` : key;
}

function getTrackedFields(keys: NestedKeyOf<any>, prefix = '', result: string[] = []): string[] {
    if (typeof keys === 'object') {
        for (const key of Object.keys(keys)) {
            const nested = keys[key];
            const field = getFieldPath(prefix, key);
            if (nested === true) {
                result.push(field);
            } else {
                getTrackedFields(nested, field, result);
            }
        }
    }
    return result;
}

/**
 * Computes all the fields that, if updated, *may* lead to a new log entry.
 * This means the tracked fields, and their outer fields.
 */
function getRelevantFields(keys: NestedKeyOf<any>, prefix = '', result: StringMap<true> = {}): StringMap<true> {
    Object.keys(keys).forEach((key) => {
        const fieldPath = getFieldPath(prefix, key);
        const value = keys[key];
        result[fieldPath] = true;
        if (typeof value === 'object') {
            getRelevantFields(value, fieldPath, result);
        }
    });

    return result;
}

function getInsertedValue(valueOrModifier: any): any {
    const result = { ...valueOrModifier };
    for (const key of Object.keys(valueOrModifier)) {
        if (key.startsWith('$')) {
            // tslint:disable-next-line:no-dynamic-delete
            delete result[key];
            switch (key) {
                case '$set':
                    Object.keys(valueOrModifier[key]).forEach((path) => {
                        setIn(result, path, valueOrModifier[key][path]);
                    });
                    break;
                default:
                // ignore
            }
        }
    }

    return result;
}

interface FetchedValue {
    _id: string;

    [key: string]: any;
}

interface LogUpdatePayload<T> extends MiddlewareUpdatePayload<T> {
    documentsBefore: FetchedValue[];
}

interface LogUpsertPayload<T> extends MiddlewareUpsertPayload<T> {
    documentsBefore: FetchedValue[];
}

interface LogRemovePayload<T> extends MiddlewareRemovePayload<T> {
    removed: FetchedValue[];
}

interface InternalLog {
    operation: ActivityLogOperation;
    fieldOperation: ActivityLogFieldOperation;
    documentId: string;
    fieldName: string;
    value: any;
}

/**
 * T is the document in the collection tat should be tracked
 * Log type of the log entries.
 */
export interface ActivityLogMiddlewareOptions<T, Log extends ActivityLog = ActivityLog> {
    /**
     * Creates a new empty log entry with default values for all required fields.
     */
    createLog(): Pick<Log, 'type' | 'userInfo'>;

    /**
     * The collection that is used for logging
     */
    logCollection: Mongo.Collection<Log>;
    /**
     * Any field that is set to `true` will be tracked.
     */
    tracked: NestedKeyOf<T>;
    /**
     * Make sure we add the logging only on the server. Use `Meteor.isServer` here.
     */
    isServer: boolean;
}

export class ActivityLogMiddleware<T, Log extends ActivityLog = ActivityLog> implements MongoCollectionMiddleware<T> {
    private collection?: Mongo.Collection<T>;
    private readonly trackedFields: string[];
    private readonly trackedFieldsMap: StringMap<true>;
    private readonly fieldsToFetch: StringMap<1>;

    private operationId = '';
    private timestamp: Date = new Date();

    constructor(private readonly options: ActivityLogMiddlewareOptions<T, Log>) {
        this.trackedFields = getTrackedFields(options.tracked);
        this.trackedFieldsMap = getRelevantFields(options.tracked);

        this.fieldsToFetch = {};
        this.trackedFields.forEach((field) => (this.fieldsToFetch[field] = 1));
    }

    onBeforeApplyToCollection(collection: Mongo.Collection<T>) {
        if (this.options.logCollection === (collection as any)) {
            throw new Error('options.logCollection and tracked collection are the same.');
        }

        this.collection = collection;
    }

    private _callNextAndLogResult(payload: any, next: (payload: any) => any, doLog: (...stuff: any) => void) {
        const hasCallback = typeof payload.callback === 'function';

        if (this.options.isServer && hasCallback) {
            const cb = payload.callback as any;
            payload.callback = (err: any, res: string) => {
                if (!err) {
                    doLog(payload, res);
                }
                cb(err, res);
            };
        }

        this.operationId = uuidv4();
        this.timestamp = new Date();
        const result = next(payload);

        if (this.options.isServer && !hasCallback) {
            doLog(payload, result);
        }

        return result;
    }

    private readonly _doLog = (log: InternalLog) => {
        // the cast `created: any` is necessary here because typescript
        // cannot associate the following object to a Log
        const created: any = this.options.createLog();
        this.options.logCollection.insert({
            ...created,
            ...log,
            timestamp: this.timestamp,
            operationId: this.operationId,
        });
    };

    private readonly _logInsert = (payload: MiddlewareInsertPayload<T>, documentId: string) => {
        const document = getInsertedValue(payload.doc);
        for (const fieldName of this.trackedFields) {
            const value = getIn(document, fieldName);
            if (typeof value !== 'undefined') {
                this._doLog({
                    operation: 'activityOpCreate',
                    fieldOperation: 'activityFieldOpCreate',
                    documentId,
                    fieldName,
                    value,
                });
            }
        }
    };

    insert(
        payload: MiddlewareInsertPayload<T>, //
        next: { (payload: MiddlewareInsertPayload<T>): string }
    ): string {
        return this._callNextAndLogResult(payload, next, this._logInsert);
    }

    private _fetchDocuments(payload: { selector: any }): FetchedValue[] {
        return this.collection!.find(payload.selector, {
            fields: this.fieldsToFetch,
        }).fetch() as any[];
    }

    private readonly _logUpdate = (payload: LogUpdatePayload<T>, _result: number) => {
        const { documentsBefore } = payload;
        // fetch the documents after the update
        const documentsAfter = this._fetchDocuments(payload);

        const logs = getActivityLogs(documentsBefore, documentsAfter, this.trackedFields);
        logs.forEach(this._doLog);
    };

    update(
        payload: MiddlewareUpdatePayload<T>, //
        next: { (payload: MiddlewareUpdatePayload<T>): number }
    ): number {
        if (!this.options.isServer || !isUpdateRelevantForTrackedFields(payload.modifier, this.trackedFieldsMap)) {
            return next(payload);
        }

        // fetch the relevant fields before the update
        const documentsBefore = this._fetchDocuments(payload);

        // do the update and log
        return this._callNextAndLogResult({ ...payload, documentsBefore }, next, this._logUpdate);
    }

    private readonly _logUpsert = (payload: LogUpsertPayload<T>, result: MiddlewareUpsertResult) => {
        if (result.insertedId) {
            const insertPayload: MiddlewareInsertPayload<T> = {
                doc: payload.modifier as OptionalId<T>,
            };
            this._logInsert(insertPayload, result.insertedId);
        }
        // works both as !== undefined and > 0
        if (result.numberAffected) {
            this._logUpdate(payload, result.numberAffected);
        }
    };

    upsert(
        payload: MiddlewareUpsertPayload<T>, //
        next: { (payload: MiddlewareUpsertPayload<T>): MiddlewareUpsertResult }
    ): MiddlewareUpsertResult {
        if (!this.options.isServer || !isUpdateRelevantForTrackedFields(payload.modifier, this.trackedFieldsMap)) {
            return next(payload);
        }

        // fetch the relevant fields before the update
        const documentsBefore = this._fetchDocuments(payload);

        return this._callNextAndLogResult({ ...payload, documentsBefore }, next, this._logUpsert);
    }

    private readonly _logRemove = (payload: LogRemovePayload<T>, _result: number) => {
        for (const fieldName of this.trackedFields) {
            for (const doc of payload.removed) {
                if (typeof getIn(doc, fieldName) !== 'undefined') {
                    this._doLog({
                        operation: 'activityOpDelete',
                        fieldOperation: 'activityFieldOpDelete',
                        documentId: doc._id,
                        fieldName,
                        value: undefined,
                    });
                }
            }
        }
    };

    remove(
        payload: MiddlewareRemovePayload<T>, //
        next: { (payload: MiddlewareRemovePayload<T>): number }
    ): number {
        const removed = this._fetchDocuments(payload);
        return this._callNextAndLogResult({ ...payload, removed }, next, this._logRemove);
    }
}
