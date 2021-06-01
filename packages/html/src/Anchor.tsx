import * as React from 'react';
import { renderUIFragment, UIFragment } from './UIFragment';

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

export type UIProps = AnchorParams & TargetParams & Events;

/**
 * A simple wrapper around the HTML anchor tag.
 */
export class Anchor extends React.PureComponent<UIProps> {
    public constructor(props: UIProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.cancelEvent = this.cancelEvent.bind(this);
    }

    // Is a native click event pending, that we want to suffice?
    private nativePending = false;

    private cancelEvent(event: React.SyntheticEvent<HTMLAnchorElement>) {
        if (this.nativePending) {
            // We want this click event to succeed, so don't cancel it

            // We only want to do this once per click, so clear the flag now
            this.nativePending = false;
            // cancel the cancellation
            return;
        }
        event.preventDefault();
        event.stopPropagation();
    }

    private handleClick(event: React.SyntheticEvent<HTMLAnchorElement>) {
        const { onClick, data, disabled } = this.props;
        if (disabled) {
            // console.log('This anchor is currently disabled; ignoring click.');
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        const { button, ctrlKey, metaKey } = event as any;
        if (!onClick) {
            // console.log('No link handler, we will return 2');
            this.nativePending = true;
            return;
        }
        if (button) {
            // console.log('Ignoring click with middle or right button');
            this.nativePending = true;
            return;
        }
        if (ctrlKey || metaKey) {
            // console.log('Ignoring click with ctrlKey / metaKey 2');
            this.nativePending = true;
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        onClick(data);
    }

    // tslint:disable-next-line:cyclomatic-complexity
    public render() {
        const { label, title, children, className, style, href, target, disabled } = this.props;
        const anchorProps: any = {
            href: href || '#',
            onMouseDown: this.handleClick,
            onClick: this.cancelEvent,
            title,
        };
        if (!!className || disabled) {
            anchorProps.className = (className || '') + (disabled ? ' disabled' : '');
        }
        if (target) {
            anchorProps.target = target;
        }
        if (style || disabled) {
            anchorProps.style = {
                ...style,
                ...(disabled ? { cursor: 'not-allowed' } : {}),
            };
        }
        return (
            <a {...anchorProps}>
                {renderUIFragment(label || '')}
                {children}
            </a>
        );
    }
}
