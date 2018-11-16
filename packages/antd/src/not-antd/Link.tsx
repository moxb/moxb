import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as Anchor from './Anchor';
import { UsesLocation } from '@moxb/moxb';

export interface LinkParams extends Anchor.AnchorParams {
    /**
     * The path tokens to set
     */
    to: string[];

    /**
     * Set the number of tokens to be preserved. further tokens will be dropped.
     */
    position?: number;
}

type LinkProps = LinkParams & Anchor.Events;

@inject('locationManager')
@observer
/**
 * A simple path-changing link component
 */
export class Link extends React.Component<LinkProps & UsesLocation> {
    public constructor(props: LinkProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    protected handleClick() {
        const { locationManager, to, position } = this.props;
        locationManager!.setPathTokens(position || 0, to);
    }

    public render() {
        const { locationManager, to, position, children, ...remnants } = this.props;
        const url = locationManager!.getURLForPathTokens(position || 0, to);
        const anchorProps: Anchor.UIProps = {
            ...remnants,
            href: url,
            onClick: this.handleClick,
        };
        return <Anchor.Anchor {...anchorProps}>{children}</Anchor.Anchor>;
    }
}
