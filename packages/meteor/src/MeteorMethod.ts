import { observable } from 'mobx';
import { meteorCall, MeteorCallback } from './MeteorCall';
import { getDebugLogger } from '@moxb/moxb';

import MethodThisType = Meteor.MethodThisType;

/**
 * Here, we provide a type-safe way to define and call a Meteor method.
 */

/**
 * This is the definition that we need to provide about a method
 */
export interface MeteorMethodDefinition<Input, Output> {
    /**
     * This will be the actual method name. (Although you won't have to use it anywhere.)
     */
    name: string;

    /**
     * Do we want to see debug output?
     */
    debug?: boolean;

    /**
     * Should this method be registered on the server side only?
     *
     * If set, then there will be no simulation for this method.
     */
    serverOnly?: boolean;

    /**
     * Should this method run unblocked?
     *
     * Setting this flag allows subsequent method from this client to begin running in a new fiber.
     */
    unblock?: boolean;

    /**
     * Do we need to check authorization before executing the call?
     */
    auth?: (input: Input, userId: string | null) => void;

    /**
     * The code to execute (on the server side) when the method is executed.
     *
     * @param input The input data. Please provide all arguments within a single object. (Like props in React)
     *
     * You can throw normal Errors in this code, they will be converted into Meteor.Errors
     */
    execute: (input: Input, userId: string | null, context: MethodThisType) => Output;
}

/**
 * This is the control object that the app code will get back, after registering the method
 */
export interface MeteorMethodControl<Input, Output> {
    /**
     * The name of the method. (Mostly useful for debugging)
     */
    readonly name: string;

    /**
     * Call the method, using the callback-style syntax
     *
     * @param data     The data to provide to the method
     * @param callback The callback to call when finished
     */
    call(data: Input, callback?: MeteorCallback<Output>): void;

    /**
     * Call the method, using Promise-style syntax
     *
     * @param data The data to provide to the method.
     */
    callPromise(data: Input): Promise<Output>;

    /**
     * Tells you if the method is currently being executed.
     *
     * This field is mobx-reactive.
     */
    pending: boolean;
}

/**
 * Create a Meteor.Error out of any normal Error.
 */
function convertError(e: Error): Meteor.Error {
    if ((e as any).errorType === 'Meteor.Error') {
        return (e as any) as Meteor.Error;
    }
    const error = (e as any).error ? (e as any).error : e.toString();
    const message = e.message;
    const details = (e as any).details || e.stack || '';
    return new Meteor.Error(error, message, details);
}

/**
 * Create a wrapper around a function, that will convert anything that is thrown into Meteor.Errors
 */
// based on https://stackoverflow.com/a/28998603/2297345
export function wrapException<A extends (...data: any[]) => unknown>(f: A): A {
    return ((...args: any[]) => {
        try {
            // eslint-disable-next-line prefer-spread
            return f.apply(undefined, args);
        } catch (e) {
            throw convertError(e as Error);
        }
    }) as any;
}

/**
 * This function registers a Meteor method, based on the provided definition, and provides a control object for it.
 */
export function registerMeteorMethod<Input, Output>(
    method: MeteorMethodDefinition<Input, Output>
): MeteorMethodControl<Input, Output> {
    const { name, debug, execute, serverOnly, unblock, auth } = method;
    const logger = getDebugLogger('Method ' + name, debug);
    if (Meteor.isServer || !serverOnly) {
        logger.log('Publishing Meteor method', name);
        Meteor.methods({
            [name]: function (this, input: Input) {
                // console.log('***Gonna check out if', name, 'is running in a simulation', this);
                // if (!this || this.isSimulation) {
                //     return;
                // }

                if (auth) {
                    auth(input, this.userId);
                }

                logger.log('with data', input);

                if (unblock) {
                    this.unblock();
                }

                const result = wrapException(execute)(input, this.userId, this);
                logger.log('returns', result);

                return result;
            },
        });
    }
    const pending = observable.box(false);
    return {
        name,
        get pending(): boolean {
            return pending.get();
        },
        call: (data: Input, callback?: MeteorCallback<Output>) => {
            pending.set(true);
            meteorCall(name, data, (error?: any, result?: any) => {
                pending.set(false);
                if (callback) {
                    callback(error, result);
                }
            });
        },
        callPromise: (data: Input): Promise<Output> =>
            new Promise<Output>((resolve, reject) => {
                pending.set(true);
                meteorCall(name, data, (error: any, result: Output) => {
                    pending.set(false);
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            }),
    };
}
