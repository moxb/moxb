import * as React from 'react';
import { UIFragment } from './UIFragment';
/**
 * Parameters for describing an anchor
 */
export interface AnchorParams {
    /**
     * The title (for popup help)
     */
    title?: string;
    /**
     * Any class names to apply
     */
    className?: string;
    /**
     * Any direct styles to apply
     */
    style?: React.CSSProperties;
    /**
     * Label to use.
     */
    label?: UIFragment;
    /**
     * Clickable? (Default: true)
     */
    disabled?: boolean;
    /**
     * Any custom data
     */
    data?: any;
    /**
     * This goes straight to HTML
     */
    target?: string;
}
export interface TargetParams {
    /**
     * Where should the anchor point to?
     */
    href?: string;
}
export interface Events {
    /**
     * If an onClick handler is given, the normal event is cancelled, the and handler is executed instead.
     *
     * If there is on onClick handler, then the link will behave
     * as the native HTML links normally do.
     */
    onClick?: (data: any) => void;
}
export declare type UIProps = AnchorParams & TargetParams & Events;
/**
 * A simple wrapper around the HTML anchor tag.
 */
export declare class Anchor extends React.PureComponent<UIProps> {
    constructor(props: UIProps);
    private nativePending;
    private cancelEvent;
    private handleClick;
    render(): JSX.Element;
}
