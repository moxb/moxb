import { BoundLink, readDecision } from '@moxb/moxb';
import { observer } from 'mobx-react';
import * as React from 'react';
import { NavLinkButtonAnt, NavLinkButtonAntParams, NavLinkButtonAntProps } from './NavLinkButtonAnt';

export interface BoundNavLinkButtonAntProps extends NavLinkButtonAntParams {
    operation: BoundLink;
}

@observer
export class BoundNavLinkButtonAnt extends React.Component<BoundNavLinkButtonAntProps> {
    render() {
        const { operation, children, ...rest } = this.props;

        if (operation.invisible) {
            return null;
        }

        const linkProps: NavLinkButtonAntProps = {
            to: operation.to,
            argChanges: operation.argChanges,
            position: operation.position,
            appendTokens: operation.appendTokens,
            removeTokenCount: operation.removeTokenCount,
            toRef: operation.toRef,
            label: operation.label,
            title: operation.help,
            disabled: readDecision(operation.disabled),
            ...rest,
        };

        return <NavLinkButtonAnt {...linkProps}>{children}</NavLinkButtonAnt>;
    }
}
