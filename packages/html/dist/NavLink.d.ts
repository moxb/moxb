import { CoreLinkProps, UsesLocation, MyLocation } from '@moxb/moxb';
import * as React from 'react';
import * as Anchor from './Anchor';
/**
 * Everything _except_ the target specification
 */
export declare type NavLinkParams = Anchor.AnchorParams;
/**
 * All the props (presentation and target)
 */
export declare type NavLinkProps = NavLinkParams & CoreLinkProps;
export declare class NavLink extends React.Component<NavLinkProps & UsesLocation> {
    constructor(props: NavLinkProps);
    /**
     * Calculate the location where this links should take us
     */
    protected getWantedLocation(): MyLocation;
    protected handleClick(): void;
    render(): JSX.Element;
}
