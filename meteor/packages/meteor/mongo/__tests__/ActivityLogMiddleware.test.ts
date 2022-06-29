import { Mongo } from 'meteor/mongo';

import { ActivityLogMiddleware, ActivityLogOperation, ActivityLogFieldOperation } from '../ActivityLogMiddleware';
import { applyMiddlewareToCollection } from '../MongoCollectionMiddlewareImpl';

interface ExpectedLog {
    operation: ActivityLogOperation;
    fieldOperation: ActivityLogFieldOperation;
    documentId: string;
    fieldName: string;
    value?: any;
    valueType?: any;
}

describe('ActivityLogMiddleware', function () {
    const dataCollection = new Mongo.Collection<any>('data');
    const logCollection = new Mongo.Collection<any>('log');
    // the id of the document inserted in beforeEach()
    let _id: string;
    applyMiddlewareToCollection(
        dataCollection,
        new ActivityLogMiddleware({
            createLog: () => ({ type: 'test-log', userInfo: { _id: 'test-user' } }),
            logCollection,
            tracked: {
                shallowField: true,
                types: {
                    string: true,
                    number: true,
                    newField: true,
                },
            },
            isServer: true,
        })
    );

    function checkAllLogsHaveSameOperationId() {
        const logs = logCollection.find({}).fetch();
        if (logs.length > 0) {
            const operationId = logs[0].operationId;
            const documentId = logs[0].documentId;

            for (const log of logs) {
                expect(log.operationId).toBe(operationId);
                expect(log.documentId).toBe(documentId);
            }
        }
    }

    function checkLogsContains(expected: ExpectedLog) {
        const logs = logCollection.find({}).fetch();
        const log = logs.find((l) => l.fieldName === expected.fieldName);
        if (!log) {
            fail(`No log with field name ${expected.fieldName} in the logs.`);
        }

        expect(log.timestamp).toBeInstanceOf(Date);
        expect(log.userInfo._id).toBe('test-user');
        expect(log.type).toBe('test-log');

        expect(log.fieldOperation).toBe(expected.fieldOperation);
        expect(log.operation).toBe(expected.operation);
        if ('value' in expected) {
            expect(log.value).toEqual(expected.value);
        }
        if ('valueType' in expected) {
            expect(log.value).toBeInstanceOf(expected.valueType);
        }
    }

    function checkLogsCountToBe(expected: number) {
        expect(logCollection.find({}).count()).toBe(expected);
    }

    function clearLogs() {
        logCollection.remove({});
    }

    beforeEach(function () {
        dataCollection.remove({});
        _id = dataCollection.insert({
            shallowField: 'shallow1',
            types: {
                ignored: 'this field should not not be logged',
                string: 'string1',
                number: 1,
            },
            ignored: 'this field should not not be logged',
        });
        clearLogs();
    });

    it('Logs insert', function () {
        const documentId = dataCollection.insert({
            shallowField: 'shallow2',
            types: { string: 'string2', ignored: 'ignored2' },
            ignored: 'ignored2',
        });
        checkLogsCountToBe(2);
        checkAllLogsHaveSameOperationId();
        checkLogsContains({
            operation: 'activityOpCreate',
            fieldOperation: 'activityFieldOpCreate',
            fieldName: 'shallowField',
            value: 'shallow2',
            documentId,
        });
        checkLogsContains({
            operation: 'activityOpCreate',
            fieldOperation: 'activityFieldOpCreate',
            fieldName: 'types.string',
            value: 'string2',
            documentId,
        });
    });

    it('Logs update with object parameter', function () {
        // nested.field has the same value has before and should not be updated
        dataCollection.update(
            { _id },
            {
                shallowField: 'shallow2',
                types: { string: 'string1', doNotTrack: 'me' },
                ignore: 'me as well',
            }
        );
        checkLogsCountToBe(2);
        checkLogsContains({
            operation: 'activityOpUpdate',
            fieldOperation: 'activityFieldOpUpdate',
            fieldName: 'shallowField',
            value: 'shallow2',
            documentId: _id,
        });
        checkLogsContains({
            operation: 'activityOpUpdate',
            fieldOperation: 'activityFieldOpDelete',
            fieldName: 'types.number',
            value: undefined,
            documentId: _id,
        });
    });

    it('logs update with $set modifier', function () {
        // shallowField has the same value has before and should not be updated
        dataCollection.update(
            { _id },
            {
                $set: { shallowField: 'shallow1', 'types.string': 'string2', thisField: { shouldBe: 'ignored' } },
            }
        );
        checkLogsCountToBe(1);
        checkLogsContains({
            operation: 'activityOpUpdate',
            fieldOperation: 'activityFieldOpUpdate',
            fieldName: 'types.string',
            value: 'string2',
            documentId: _id,
        });
    });

    it('Logs update with $set modifier when updating outer object', function () {
        dataCollection.update(
            { _id },
            {
                $set: {
                    types: { string: 'string2', newField: 'new value', ignored: 'ignore me' },
                    newField: "I'm not tracked either",
                },
            }
        );
        checkLogsCountToBe(3);
        checkLogsContains({
            operation: 'activityOpUpdate',
            fieldOperation: 'activityFieldOpUpdate',
            fieldName: 'types.string',
            value: 'string2',
            documentId: _id,
        });
        checkLogsContains({
            operation: 'activityOpUpdate',
            fieldOperation: 'activityFieldOpCreate',
            fieldName: 'types.newField',
            value: 'new value',
            documentId: _id,
        });
        checkLogsContains({
            operation: 'activityOpUpdate',
            fieldOperation: 'activityFieldOpDelete',
            fieldName: 'types.number',
            value: undefined,
            documentId: _id,
        });
    });

    it('logs update with $inc modifier', function () {
        dataCollection.update(
            { _id },
            {
                $inc: { 'types.number': true, 'ignore.me': true },
            }
        );

        checkLogsCountToBe(1);
        checkLogsContains({
            operation: 'activityOpUpdate',
            fieldOperation: 'activityFieldOpUpdate',
            fieldName: 'types.number',
            value: 2,
            documentId: _id,
        });
    });

    it('logs update with both $inc and $set modifiers', function () {
        // types.string is the same as before and should be ignored.
        dataCollection.update(
            { _id },
            {
                $inc: { 'types.number': true, 'ignore.me': true },
                $set: {
                    shallowField: 'shallow2',
                    'types.string': 'string1',
                    'types.ignoreme': 'This fields should not be logged',
                },
            }
        );

        checkLogsCountToBe(2);
        checkLogsContains({
            operation: 'activityOpUpdate',
            fieldOperation: 'activityFieldOpUpdate',
            fieldName: 'types.number',
            value: 2,
            documentId: _id,
        });
        checkLogsContains({
            operation: 'activityOpUpdate',
            fieldOperation: 'activityFieldOpUpdate',
            fieldName: 'shallowField',
            value: 'shallow2',
            documentId: _id,
        });
    });

    it('logs upsert on update', function () {
        dataCollection.upsert(
            { _id },
            {
                $set: {
                    'types.string': 'string 2',
                    newField: "I'm not tracked either",
                },
            }
        );

        checkLogsCountToBe(1);
        checkLogsContains({
            operation: 'activityOpUpdate',
            fieldOperation: 'activityFieldOpUpdate',
            fieldName: 'types.string',
            value: 'string 2',
            documentId: _id,
        });
    });

    it('logs upsert on insert with $set modifier', function () {
        dataCollection.upsert(
            { _id: 'new-id' },
            {
                $set: { types: { string: 'string 1', number: 4 } },
            }
        );

        checkLogsCountToBe(2);
        checkLogsContains({
            operation: 'activityOpCreate',
            fieldOperation: 'activityFieldOpCreate',
            fieldName: 'types.string',
            value: 'string 1',
            documentId: _id,
        });
        checkLogsContains({
            operation: 'activityOpCreate',
            fieldOperation: 'activityFieldOpCreate',
            fieldName: 'types.number',
            value: 4,
            documentId: _id,
        });
    });

    it('logs upsert on insert with value as modifier', function () {
        dataCollection.upsert(
            { _id: 'new-id' },
            {
                types: {
                    string: 'string 1',
                    number: 1,
                },
            }
        );

        checkLogsCountToBe(2);
        checkLogsContains({
            operation: 'activityOpCreate',
            fieldOperation: 'activityFieldOpCreate',
            fieldName: 'types.string',
            value: 'string 1',
            documentId: _id,
        });
        checkLogsContains({
            operation: 'activityOpCreate',
            fieldOperation: 'activityFieldOpCreate',
            fieldName: 'types.number',
            value: 1,
            documentId: _id,
        });
    });

    it('logs remove and ignore unset fields', function () {
        dataCollection.remove({ _id });

        checkLogsCountToBe(3);
        checkLogsContains({
            operation: 'activityOpDelete',
            fieldOperation: 'activityFieldOpDelete',
            fieldName: 'shallowField',
            value: undefined,
            documentId: _id,
        });
        checkLogsContains({
            operation: 'activityOpDelete',
            fieldOperation: 'activityFieldOpDelete',
            fieldName: 'types.number',
            value: undefined,
            documentId: _id,
        });
        checkLogsContains({
            operation: 'activityOpDelete',
            fieldOperation: 'activityFieldOpDelete',
            fieldName: 'types.string',
            value: undefined,
            documentId: _id,
        });
    });
});
