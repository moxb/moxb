import * as React from 'react';
import { isForwardRef } from './isForwardRef';

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
    // console.log('Rendering fragment', typeof fragment, fragment, fragment.type, typeof fragment.type);
    if (
        typeof fragment === 'function' ||
        isForwardRef(fragment) ||
        (typeof fragment === 'object' && typeof (fragment as any).type === 'function')
    ) {
        return React.createElement(fragment as any, props);
    }
    return fragment as JSX.Element;
};
