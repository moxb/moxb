import { BoundLink, readDecision } from '@moxb/moxb';
import { observer } from 'mobx-react';
import * as React from 'react';
import { NavLink, NavLinkParams, NavLinkProps } from './NavLink';

/**
 * To get all the props, take the presentation params (not the target specification!), and add the operation
 */
export interface BoundNavLinkProps extends NavLinkParams {
    operation: BoundLink;
}

export const BoundNavLink = observer(class BoundNavLink extends React.Component<BoundNavLinkProps> {
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
            toRef: operation.toRef,
            title: operation.help,
            disabled: readDecision(operation.disabled),
            ...rest,
        };

        return <NavLink {...linkProps}>{children}</NavLink>;
    }
});
