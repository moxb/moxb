import { Meteor } from 'meteor/meteor';

export type MeteorCallback<T> = (error?: any, result?: T) => void;

/**
 * If no callback given, it throws an error if the client simulation fails.
 * @param {string} method
 * @param args
 * @returns {any}
 */
export function meteorCall(method: string, ...args: any[]) {
    let cb;
    const lastArg = args[args.length - 1];
    if (typeof lastArg === 'function' || lastArg === undefined) {
        cb = args.pop();
    } else {
        // throw new Meteor.Error(`Last arg is not a function but a ${typeof lastArg}`);
    }
    // see https://github.com/meteor/meteor/issues/8435
    if (cb) {
        try {
            return Meteor.apply(method, args, { throwStubExceptions: true }, cb);
        } catch (e) {
            cb(e);
        }
    } else {
        return Meteor.apply(method, args, { throwStubExceptions: true });
    }
}
