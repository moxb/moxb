import { Action, ActionImpl, ActionOptions, BindOptions, ValueOrFunction } from '@moxb/moxb';
import { MeteorMethodControl } from './MeteorMethod';
import { observable } from 'mobx';

/**
 * The main idea here is that it should be trivial to define a (moxb) Action that is backed by a Meteor method,
 * so that we have type safety on the input and on the output side, we can't misspell the method name, and
 * we also get automatic integration for things like indicating the pending state on buttons, etc.
 */

/**
 * This is how we describe a Meteor method-based action
 */
interface MeteorActionOptions<Input, Output> extends BindOptions {
    /**
     * A (control object to a) Meteor method to use
     */
    method: MeteorMethodControl<Input, Output>;

    /**
     * Do we want to see debug output related to this action?
     */
    debug?: boolean;

    /**
     * The input to pass to this method (or a function to collect it)
     */
    input: ValueOrFunction<Input>;

    /**
     * An optional callback to call (with the current input) before actually executing the method call
     * @param input
     */
    before?: (input: Input) => void;

    /**
     * Error handler to call when the method fails
     */
    failed: (error: Meteor.Error) => void;

    /**
     * A callback to call when the method succeeds
     *
     * @param result       The returned data
     * @param clearPending You can call this callback if you want to clear the pending flag sooner.
     *                     The pending flag will normally be cleared right after this 'returned' callback
     *                     is executed, but if you need it sooner, you can do that by calling this.
     */
    returned: (result: Output, clearPending: Function) => void;
}

/**
 * This function will create a Meteor method-backed moxb Action based on the provided description (see above).
 */
export function createMeteorAction<Input, Output>(options: MeteorActionOptions<Input, Output>): Action {
    const { method, input, before, failed, returned, debug, ...rest } = options;

    const _pending = observable.box(false);

    const clearPending = () => _pending.set(false);

    function getData(): Input {
        if (typeof input === 'function') {
            return (input as Function)();
        } else {
            return input!;
        }
    }

    const debugLog = debug
        ? (...stuff: any[]) => {
              console.log('Meteor method action', '"' + options.id + '"', ':', ...stuff);
          }
        : () => {};

    const actionOptions: ActionOptions = {
        ...rest,
        pending: () => _pending.get(),
        fire: () =>
            new Promise((resolve, reject) => {
                _pending.set(true);
                const data = getData();
                if (before) {
                    before(data);
                }
                debugLog('Calling method', '"' + method.name + '"', 'with', data);
                const start = Date.now();
                method
                    .callPromise(data)
                    .then(result => {
                        const stop = Date.now();
                        debugLog('Returned in', stop - start, 'ms.', 'result:', result);
                        returned(result, clearPending);
                        clearPending();
                        resolve();
                    })
                    .catch(error => {
                        const stop = Date.now();
                        debugLog('Failed in', stop - start, 'ms.', 'error:', error);
                        if (failed) {
                            failed(error);
                        }
                        clearPending();
                        reject(error);
                    });
            }),
    };

    return new ActionImpl(actionOptions);
}

// Just preparation for some TS magic
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * We also provide a shortcut for methods with no input.
 * In this case, we don't have to define the input function.
 */
type MeteorSimpleActionOptions<Output> = Omit<MeteorActionOptions<void, Output>, 'input'>;

/**
 * This function will create a Meteor method-backed moxb Action based on the provided description (see above).
 *
 * Use this with methods that don't require any input arguments.
 */
export function createMeteorSimpleAction<Output>(options: MeteorSimpleActionOptions<Output>): Action {
    return createMeteorAction<void, Output>({
        ...options,
        input: () => undefined,
    });
}
