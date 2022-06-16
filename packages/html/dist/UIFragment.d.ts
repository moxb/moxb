import * as React from 'react';
declare type Component<T> = (props: T) => JSX.Element | null;
/**
 * A UIFragment is something that can be displayed.
 * It can be a string, some HTML content, some component,
 * or even a component class.
 * It will be rendered accordingly.
 */
export declare type UIFragment = string | JSX.Element | Component<any> | React.ComponentClass<any>;
/**
 * This function will render any UIFragment.
 *
 * When rendering a component, it also accepts some props.
 */
export declare const renderUIFragment: (fragment: string | JSX.Element | Component<any> | React.ComponentClass<any, any> | undefined, props?: Object) => JSX.Element | null;
export {};
