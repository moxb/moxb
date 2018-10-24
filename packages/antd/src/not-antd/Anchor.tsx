import * as React from 'react';
import { UIFragment, renderFragment } from '@moxb/moxb';

export interface AnchorParams {
    title?: string;
    className?: string;
    label?: UIFragment;
    disabled?: boolean;
    data?: any;
}

export interface TargetParams {
    href?: string;
}

export interface Events {
    // If an onClick handler is given, the normal event is cancelled,
    // the and handler is executed instead.
    //
    // If there is on onClick handler, then the link will behave
    // as the native HTML links normally do.
    onClick?: (data: any) => void;
}

export type UIProps = AnchorParams & TargetParams & Events;

export class Anchor extends React.PureComponent<UIProps> {
    public constructor(props: UIProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.cancelEvent = this.cancelEvent.bind(this);
    }

    private cancelEvent(event: React.SyntheticEvent<HTMLAnchorElement>) {
        const { onClick } = this.props;
        if (!onClick) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
    }

    private handleClick(event: React.SyntheticEvent<HTMLAnchorElement>) {
        const { onClick, data } = this.props;
        if (!onClick) {
            console.log('No link handler, we will return');
            return;
        }
        if ((event as any).button) {
            console.log('Ignoring middle or right button');
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        onClick(data);
    }

    public render() {
        const { label, title, children, className, href, disabled } = this.props;
        return (
            <a
                href={href || '#'}
                onMouseDown={this.handleClick}
                onClick={this.cancelEvent}
                title={title}
                className={className + (disabled ? ' disabled' : '')}
            >
                {renderFragment(label || '')}
                {children}
            </a>
        );
    }
}