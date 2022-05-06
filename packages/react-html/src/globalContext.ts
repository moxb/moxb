import * as React from 'react';

// Let's access global more freely
const globalFreedom = global as any;

// Make sure we have our repository
if (!globalFreedom.contexts) {
    globalFreedom.contexts = {};
}

// Let's get a (more) type-safe reference to our context repo
const repo = globalFreedom.contexts as Record<string, React.Context<any>>;

/**
 * Create a new (or return an existing) React context
 *
 * The point of this utility is that because of various NPM module dependency declaration / resolution methods,
 * it's not easy to enforce the singleton nature of React context objects.
 *
 * We might end up with a situation where we have multiple instances of this library loaded,
 * into separate module namespaces, and even if you create your React context in a single file,
 * you might end up with multiple independent copies of it, depending on your current import path,
 * and those instances won't communicate with each other.
 *
 * Using this utility avoids this problem.
 */
export function createGlobalContext<T>(key: string, defaultValue: T): React.Context<T> {
    if (!repo[key]) {
        // console.log('Setting up new global context', key);
        repo[key] = React.createContext<T>(defaultValue);
    } else {
        // console.log('Reusing exising global context', key);
    }
    return repo[key];
}
