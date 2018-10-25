import * as React from 'react';
import { observer } from 'mobx-react';
import * as Anchor from './Anchor';
import { UrlArg } from '@moxb/moxb';

export interface ArgChangingLinkParams<T> extends Anchor.AnchorParams {
    // The argument to change
    arg: UrlArg<T>;

    // The value to set upon clicking
    value: T;
}

type ArgChangingLinkProps = ArgChangingLinkParams<any> & Anchor.Events;

@observer
export class ArgChangingLink extends React.Component<ArgChangingLinkProps> {
    public constructor(props: ArgChangingLinkProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    protected handleClick() {
        const { arg, value } = this.props;
        arg.value = value;
    }

    public render() {
        const { arg, value, children, ...remnants } = this.props;
        const url = arg.getModifiedUrl(value);
        const anchorProps: Anchor.UIProps = {
            ...remnants,
            href: url,
            onClick: this.handleClick,
        };
        return <Anchor.Anchor {...anchorProps}>{children}</Anchor.Anchor>;
    }
}
