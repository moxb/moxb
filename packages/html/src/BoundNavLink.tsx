import { BoundLink } from '@moxb/moxb';
import { observer } from 'mobx-react';
import * as React from 'react';
import { NavLink, NavLinkParams, NavLinkProps } from './NavLink';

/**
 * To get all the props, take the presentation params (not the target specification!), and add the operation
 */
export interface BoundNavLinkProps extends NavLinkParams {
    operation: BoundLink;
}

@observer
export class BoundNavLink extends React.Component<BoundNavLinkProps> {
    render() {
        const { operation, children, ...rest } = this.props;

        if (operation.invisible) {
            return null;
        }

        const linkProps: NavLinkProps = {
            to: operation.to,
            argChanges: operation.argChanges,
            position: operation.position,
            appendTokens: operation.appendTokens,
            removeTokenCount: operation.removeTokenCount,
            label: operation.label,
            ...rest,
        };

        return <NavLink {...linkProps}>{children}</NavLink>;
    }
}
