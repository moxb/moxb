//@ts-ignore Implicit any
import mongodb = require('mongo-mock');

mongodb.max_delay = 0; //you can choose to NOT pretend to be async (default is 400ms)
const MongoClient = mongodb.MongoClient;

// this function makes mongo-mock sync, by patching setTimeout and then calling the function...
function forceSync(f: Function, self?: any, args?: any[]) {
    const origSetTimeout = global.setTimeout;
    const origPromise = global.Promise;
    try {
        // patch to immediately execute async function in the 'mongo-mock' library
        global.setTimeout = (func: Function) => func();
        // terrible hack to call then immediately
        // May need some more functions to be mocked later...
        global.Promise = {
            resolve(r: any) {
                this.result = r;
                return this;
            },
            then(func: Function) {
                func.apply(null, [this.result]);
            },
        } as any;
        // we now apply the function
        let result: any = undefined;
        f.apply(self, [...(args || []), (_err: any, r: any) => (result = r)]);
        return result;
    } finally {
        // revert the functions back...
        global.setTimeout = origSetTimeout;
        global.Promise = origPromise;
    }
}

const fakeMongo = forceSync(MongoClient.connect, MongoClient, ['mongodb://localhost:27017/myproject', {}]);

class Collection {
    collection: any;
    constructor(name: string) {
        this.collection = fakeMongo.collection(name);
    }
    private _doInsert(args: any[]) {
        const result = forceSync(this.collection.insert, this.collection, args);
        return result.insertedIds[0];
    }
    insert(...args: any[]) {
        return this._doInsert(args);
    }
    upsert(...args: any[]) {
        // no upsert in mongo-mock... so to it ourselves

        // first, try to update
        const numberAffected = this._doUpdate(args);
        if (numberAffected > 0) {
            return { numberAffected };
        }

        const insertedId = this._doInsert([args[0]]);
        return { insertedId };
    }

    private _doUpdate(args: any[]) {
        // meteor allows id as first arg...
        if (typeof args[0] === 'string') {
            args[0] = { _id: args[0] };
        }
        // mongo-mock doesn't support $inc, but we need to test it in ActivityLogMiddleware.test.ts
        if (args[1] && args[1].$inc && args[1].$inc['types.number']) {
            args[1] = { $set: { ...args[1].$set, ['types.number']: 2 } };
        }

        const result = forceSync(this.collection.update, this.collection, args);
        return (result && result.result && result.result.nModified) || 0;
    }

    update(...args: any[]) {
        return this._doUpdate(args);
    }
    remove(...args: any[]) {
        // meteor allows id as first arg...
        if (typeof args[0] === 'string') {
            args[0] = { _id: args[0] };
        }
        return forceSync(this.collection.remove, this.collection, args);
    }
    findOne(...args: any[]) {
        // meteor allows id as first arg...
        if (typeof args[0] === 'string') {
            args[0] = { _id: args[0] };
        }
        return forceSync(this.collection.findOne, this.collection, args);
    }
    find(...args: any[]) {
        // meteor allows id as first arg...
        if (typeof args[0] === 'string') {
            args[0] = { _id: args[0] };
        }
        // mongo-mock doesn't seem to support this
        if (args[1] && args[1].fields) {
            args.splice(1, 1);
        }
        let result: any[] = [];
        forceSync(() => {
            // we get the cursor
            const cursor = this.collection.find.apply(this.collection, args);
            // and turn it into an array
            return cursor.toArray((_err: any, x: any) => (result = x));
        });

        return {
            count: () => result.length,
            fetch: () => result,
            map: (fn: any) => result.map(fn),
            forEach: (fn: any) => result.forEach(fn),
            observe: () => {
                throw new Error('observe() not implemented in mock cursor');
            },
            observeChanges: () => {
                throw new Error('observeChanges() not implemented in mock cursor');
            },
        };
    }
    attachSchema() {}
    _ensureIndex() {}
}

export const Mongo = {
    Collection,
};
