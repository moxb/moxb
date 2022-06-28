const Future = require('fibers/future');
const Fiber = require('fibers');

type SimpleFunction<T> = () => T;
type PromiseFunction<T> = () => Promise<T>;
type AsyncCallback<T> = (error: string | null, result: T | null) => void;
type FuncWithCallback<T> = (callback: AsyncCallback<T>) => void;

/**
 * Convert an asynchronous function that returns a promise to use node-style callbacks
 *
 * @param promiseFunction       The function to wrap. Must have no arguments, and return a promise.
 * @param context The context to run the function on.
 */
function wrapPromise0<Result>(promiseFunction: PromiseFunction<Result>, context?: any): FuncWithCallback<Result> {
    return (callback: AsyncCallback<Result>) => {
        // console.log('Executing promise function 0');
        promiseFunction.apply(context).then(
            (value: Result) => callback(null, value),
            (reason: string) => callback(reason, null)
        );
    };
}

/**
 * Convert an asynchronous function that returns a promise into a synchronous function,
 * using Futures.
 *
 * @param promiseFunction The function to wrap. Must have no arguments, and return a promise.
 * @param context         The context to run a function on.
 */
export function wrapPromiseAsync0<Result>(
    promiseFunction: PromiseFunction<Result>,
    context?: any
): SimpleFunction<Result> {
    const cbFunction = wrapPromise0(promiseFunction, context);
    const futureFunction = Future.wrap(cbFunction);

    const simpleFunction: SimpleFunction<Result> = () => Future.task(() => futureFunction().wait() as Result).wait();

    return simpleFunction;
}

// For functions with one parameter
type SimpleFunction1<D, T> = (data: D) => T;
type PromiseFunction1<D, T> = (data: D) => Promise<T>;
type FuncWithCallback1<D, T> = (data: D, callback: AsyncCallback<T>) => void;

/**
 * Convert an asynchronous function that returns a promise to use node-style callbacks
 *
 * @param promiseFunction The function to convert. Must have one argument, and return a promise.
 * @param context         The context to run the function on.
 */
function wrapPromise1<Data, Result>(
    promiseFunction: PromiseFunction1<Data, Result>,
    context?: any
): FuncWithCallback1<Data, Result> {
    return (data: Data, callback: AsyncCallback<Result>) => {
        // console.log('Executing promise function 1, data:', data, 'callback:', callback);
        // console.trace();
        promiseFunction.apply(context, [data]).then(
            (value: Result) => callback(null, value),
            (reason: string) => callback(reason, null)
        );
    };
}

/**
 * Convert an asynchronous function that returns a promise to a synchronous function
 *
 * @param promiseFunction The function to convert. Must have one argument, and return a promise.
 * @param context         The context to run the function on.
 */
export function wrapPromiseAsync1<Data, Result>(
    promiseFunction: PromiseFunction1<Data, Result>,
    context?: any
): SimpleFunction1<Data, Result> {
    const cbFunction = wrapPromise1(promiseFunction, context);
    const futureFunction = Future.wrap(cbFunction);

    const simpleFunction: SimpleFunction1<Data, Result> = (data: Data) =>
        Future.task(() => futureFunction(data).wait() as Result).wait();

    return simpleFunction;
}

// For functions with two parameters
type SimpleFunction2<D1, D2, T> = (data1: D1, data2: D2) => T;
type PromiseFunction2<D1, D2, T> = (data1: D1, data2: D2) => Promise<T>;
type FuncWithCallback2<D1, D2, T> = (data1: D1, data2: D2, callback: AsyncCallback<T>) => void;

/**
 * Convert an asynchronous function that returns a promise to use node-style callbacks
 *
 * @param promiseFunction The function to convert. Must have two arguments, and return a promise.
 * @param context         The context to run the function on.
 */
function wrapPromise2<D1, D2, Result>(
    promiseFunction: PromiseFunction2<D1, D2, Result>,
    context?: any
): FuncWithCallback2<D1, D2, Result> {
    return (data1: D1, data2: D2, callback: AsyncCallback<Result>) => {
        promiseFunction.apply(context, [data1, data2]).then(
            (value: Result) => callback(null, value),
            (reason: string) => callback(reason, null)
        );
    };
}

/**
 * Convert an asynchronous function that returns a promise to a synchronous function
 *
 * @param promiseFunction The function to convert. Must have two arguments, and return a promise.
 * @param context         The context to run the function on.
 */
export function wrapPromiseAsync2<Data1, Data2, Result>(
    promiseFunction: PromiseFunction2<Data1, Data2, Result>,
    context?: any
): SimpleFunction2<Data1, Data2, Result> {
    const cbFunction = wrapPromise2(promiseFunction, context);
    const futureFunction = Future.wrap(cbFunction);

    const simpleFunction: SimpleFunction2<Data1, Data2, Result> = (data1: Data1, data2: Data2) =>
        Future.task(() => futureFunction(data1, data2).wait() as Result).wait();

    return simpleFunction;
}

// For functions with three parameters
type SimpleFunction3<D1, D2, D3, T> = (data1: D1, data2: D2, data3: D3) => T;
type PromiseFunction3<D1, D2, D3, T> = (data1: D1, data2: D2, data3: D3) => Promise<T>;
type FuncWithCallback3<D1, D2, D3, T> = (data1: D1, data2: D2, data3: D3, callback: AsyncCallback<T>) => void;

/**
 * Convert an asynchronous function that returns a promise to use node-style callbacks
 *
 * @param promiseFunction The function to convert. Must have three arguments, and return a promise.
 * @param context         The context to run the function on.
 */
function wrapPromise3<D1, D2, D3, Result>(
    promiseFunction: PromiseFunction3<D1, D2, D3, Result>,
    context?: any
): FuncWithCallback3<D1, D2, D3, Result> {
    return (data1: D1, data2: D2, data3: D3, callback: AsyncCallback<Result>) => {
        promiseFunction.apply(context, [data1, data2, data3]).then(
            (value: Result) => callback(null, value),
            (reason: string) => callback(reason, null)
        );
    };
}

/**
 * Convert an asynchronous function that returns a promise to a synchronous function
 *
 * @param promiseFunction The function to convert. Must have three arguments, and return a promise.
 * @param context         The context to run the function on.
 */
export function wrapPromiseAsync3<Data1, Data2, Data3, Result>(
    promiseFunction: PromiseFunction3<Data1, Data2, Data3, Result>,
    context?: any
): SimpleFunction3<Data1, Data2, Data3, Result> {
    const cbFunction = wrapPromise3(promiseFunction, context);
    const futureFunction = Future.wrap(cbFunction);

    const simpleFunction: SimpleFunction3<Data1, Data2, Data3, Result> = (data1: Data1, data2: Data2, data3: Data3) =>
        Future.task(() => futureFunction(data1, data2, data3).wait() as Result).wait();

    return simpleFunction;
}

// For functions with one optional parameter
type SimpleFunction1m<D, T> = (data?: D) => T;
type PromiseFunction1m<D, T> = (data?: D) => Promise<T>;

function wrapMaybe1<Data, Result>(
    f: SimpleFunction1m<Data, Result>,
    defaultValue: Data
): SimpleFunction1m<Data, Result> {
    return (data) => {
        const realData: Data = data === undefined ? defaultValue : data;
        return f(realData);
    };
}

export function wrapPromiseAsync1m<Data, Result>(
    f: PromiseFunction1m<Data, Result>,
    defaultValue: Data,
    context?: any
): SimpleFunction1m<Data, Result> {
    return wrapMaybe1(wrapPromiseAsync1(f, context), defaultValue);
}

// For functions with one fixed and one optional parameter
type SimpleFunction2m<D1, D2, T> = (d1: D1, d2?: D2) => T;
type PromiseFunction2m<D1, D2, T> = (d1: D1, d2?: D2) => Promise<T>;

function wrapMaybe2<D1, D2, Result>(
    f: SimpleFunction2m<D1, D2, Result>,
    defaultValue: D2
): SimpleFunction2m<D1, D2, Result> {
    return (d1, d2?) => f(d1, d2 === undefined ? defaultValue : d2);
}

export function wrapPromiseAsync2m<D1, D2, Result>(
    f: PromiseFunction2m<D1, D2, Result>,
    defaultValue: D2,
    context?: any
): SimpleFunction2m<D1, D2, Result> {
    return wrapMaybe2(wrapPromiseAsync2(f, context), defaultValue);
}

// For functions with one fixed and one optional parameter
type SimpleFunction3m<D1, D2, D3, T> = (d1: D1, d2: D2, d3?: D3) => T;
type PromiseFunction3m<D1, D2, D3, T> = (d1: D1, d2: D2, d3?: D3) => Promise<T>;

function wrapMaybe3<D1, D2, D3, Result>(
    f: SimpleFunction3m<D1, D2, D3, Result>,
    defaultValue: D3
): SimpleFunction3m<D1, D2, D3, Result> {
    return (d1, d2: D2, d3?) => f(d1, d2, d3 === undefined ? defaultValue : d3);
}

export function wrapPromiseAsync3m<D1, D2, D3, Result>(
    f: PromiseFunction3m<D1, D2, D3, Result>,
    defaultValue: D3,
    context?: any
): SimpleFunction3m<D1, D2, D3, Result> {
    return wrapMaybe3(wrapPromiseAsync3(f, context), defaultValue);
}

export function sleep(ms: number) {
    const fiber = Fiber.current;
    setTimeout(function () {
        fiber.run();
    }, ms);
    Fiber.yield();
}
