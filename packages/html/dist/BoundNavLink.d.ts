import { BoundLink } from '@moxb/moxb';
import * as React from 'react';
import { NavLinkParams } from './NavLink';
/**
 * To get all the props, take the presentation params (not the target specification!), and add the operation
 */
export interface BoundNavLinkProps extends NavLinkParams {
    operation: BoundLink;
}
export declare class BoundNavLink extends React.Component<BoundNavLinkProps> {
    render(): JSX.Element | null;
}
