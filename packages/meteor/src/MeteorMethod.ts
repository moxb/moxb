import { action, makeObservable, observable } from 'mobx';
import { meteorCall, MeteorCallback } from './MeteorCall';
import { getDebugLogger, Logger } from '@moxb/moxb';

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
 * A control object for using the registered method
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
    readonly pending: boolean;
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
 * Wrapper object to manage the method.
 *
 * This is a technical implementation detail.
 */
class MeteorMethodControlImpl<Input, Output> implements MeteorMethodControl<Input, Output> {
    private readonly _myMeteor: typeof Meteor;

    private readonly _logger: Logger;

    constructor(private readonly _definition: MeteorMethodDefinition<Input, Output>, meteorInstance?: typeof Meteor) {
        makeObservable(this);
        this.callPromise = this.callPromise.bind(this);
        const { name, debug, execute, serverOnly, unblock, auth } = _definition;

        // Try to use the supplied Meteor instance,
        // without even looking at the global Meteor object first,
        // in order to avoid the "Meteor is undefined" JS error.
        let myMeteor = meteorInstance;
        if (!myMeteor) {
            // Only use the global Meteor object if no instance was provided
            myMeteor = Meteor;
        }
        this._myMeteor = myMeteor;
        const logger = (this._logger = getDebugLogger('Method ' + name, debug));

        if (myMeteor.isServer || !serverOnly) {
            this._logger.log('Publishing Meteor method', name);
            myMeteor.methods({
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

                    try {
                        const result = wrapException(execute)(input, this.userId, this);
                        logger.log('returns', result);

                        return result;
                    } catch (execError) {
                        logger.log('Exception', execError);
                        throw execError;
                    }
                },
            });
        }
    }

    get name() {
        return this._definition.name;
    }

    @observable
    _pending = false;

    get pending() {
        return this._pending;
    }

    @action
    setPending(value: boolean) {
        this._pending = value;
    }

    call(data: Input, callback?: MeteorCallback<Output>) {
        this.setPending(true);
        meteorCall(this.name, data, (error?: any, result?: any) => {
            this.setPending(false);
            if (callback) {
                callback(error, result);
            }
        });
    }

    callPromise(data: Input): Promise<Output> {
        return new Promise<Output>((resolve, reject) => {
            this.setPending(true);

            meteorCall(this.name, data, (error: any, result: Output) => {
                this.setPending(false);
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

/**
 * This function registers a Meteor method, based on the provided definition, and provides a control object for it.
 */
export function registerMeteorMethod<Input, Output>(
    /**
     * The definition of the method
     */
    method: MeteorMethodDefinition<Input, Output>,
    /**
     * Optionally, provide an instance of Meteor to use.
     *
     * This can be necessary in situations when the global singleton Meteor object is not available in the global
     * namespace, because it has been hidden my some collision avoidance mechanism.
     *
     * Specifically, this is the case when this NPM module is imported from within a Meteor package.
     */
    meteorInstance?: typeof Meteor
): MeteorMethodControl<Input, Output> {
    return new MeteorMethodControlImpl(method, meteorInstance);
}
