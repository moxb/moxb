import * as React from 'react';

type Component<T> = (props: T) => JSX.Element | null;

/**
 * A UIFragment is something that can be displayed.
 * It can be a string, some HTML content, some component,
 * or even a component class.
 * It will be rendered accordingly.
 */
export type UIFragment = string | JSX.Element | Component<any> | React.ComponentClass<any>;

/**
 * This function will render any UIFragment.
 *
 * When rendering a component, it also accepts some props.
 */
export const renderUIFragment = (fragment: UIFragment | undefined, props: Object = {}): JSX.Element | null => {
    if (fragment === undefined) {
        return null;
    }
    if (typeof fragment === 'function') {
        // This is a component
        const component: Component<any> = fragment as Component<any>;
        return React.createElement(component, props);
    } else {
        // This is an element
        const element: JSX.Element = fragment as JSX.Element;
        return element;
    }
};
