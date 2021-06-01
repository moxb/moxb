import { CoreLinkProps, locationToUrl, UsesLocation, MyLocation } from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as Anchor from './Anchor';

/**
 * Everything _except_ the target specification
 */
export type NavLinkParams = Anchor.AnchorParams;

/**
 * All the props (presentation and target)
 */
export type NavLinkProps = NavLinkParams & CoreLinkProps;

@inject('locationManager')
@observer
/**
 * A simple path-changing link component
 */
export class NavLink extends React.Component<NavLinkProps & UsesLocation> {
    public constructor(props: NavLinkProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Calculate the location where this links should take us
     */
    protected getWantedLocation(): MyLocation {
        const { position, to, argChanges, appendTokens, removeTokenCount, toRef } = this.props;
        return this.props.locationManager!.getNewLocationForLinkProps({
            position,
            to,
            argChanges,
            appendTokens,
            removeTokenCount,
            toRef,
        });
    }

    protected handleClick() {
        this.props.locationManager!.trySetLocation(this.getWantedLocation());
    }

    public render() {
        const { children, ...remnants } = this.props;
        const { target } = this.props;
        return (
            <Anchor.Anchor
                href={locationToUrl(this.getWantedLocation())}
                onClick={target ? undefined : this.handleClick}
                {...remnants}
            >
                {children}
            </Anchor.Anchor>
        );
    }
}
