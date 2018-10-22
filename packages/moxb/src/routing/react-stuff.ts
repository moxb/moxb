import * as React from 'react';

type Component<T> = {
    (props: T): JSX.Element;
};

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

/**
 * An UIFragmentMap is simply a map of UI fragments.
 */
export interface UIFragmentMap {
    [id: string]: UIFragment;
}

/**
 * An UIFragmentSpec is either a simple UIFragment, or a map of UIFragments.
 *
 * It can be used in situations when we either expect a simple fragment,
 * or potentially a map of fragments.
 */
export type UIFragmentSpec = UIFragment | UIFragmentMap | undefined;

/**
 * Determine whether an UIFragmentSpec value is actually a map
 */
const isFragmentMap = (spec: UIFragmentSpec): boolean => {
    if (typeof spec !== 'object') {
        return false;
    }
    if ((spec as any).main) {
        return true;
    }
    return !(spec as any).props;
};

/**
 * Convert an UIFragmentSpec to the map format, if it's not already a map
 */
const getFragmentMap = (spec: UIFragmentSpec, debug?: boolean): UIFragmentMap => {
    const alreadyMap = isFragmentMap(spec);
    if (!!debug) {
        console.log('Is spec a map?', alreadyMap, typeof spec);
    }
    return alreadyMap ? (spec as UIFragmentMap) : { main: spec as UIFragment };
};

/**
 * Look up a specific key from an UIFragmentSpec
 */
export const getFragmentPart = (spec: UIFragmentSpec, part?: string, debug?: boolean) => {
    const map = getFragmentMap(spec, debug);
    const wanted = part || 'main';
    const result = (map as any)[wanted] || null;
    if (!!debug) {
        console.log('Map is', map);
        console.log('Wanted part is', part);
        console.log('Result is', result);
    }
    return result;
};
