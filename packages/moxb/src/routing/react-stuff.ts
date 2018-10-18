import * as React from 'react';

type Component<T> = {
    (props: T): JSX.Element;
};

export type UIFragment = string | JSX.Element | Component<any> | React.ComponentClass<any>;

export const renderFragment = (fragment: UIFragment, props: Object = {}): JSX.Element | null => {
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
