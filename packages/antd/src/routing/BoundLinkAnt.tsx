import { BoundLink } from '@moxb/moxb';
import { observer } from 'mobx-react';
import * as React from 'react';
import { LinkAnt, LinkAntProps, LinkAntStyleProps } from './LinkAnt';
import { AnchorParams } from '../not-antd/Anchor';

export interface BoundLinkAntProps extends AnchorParams, LinkAntStyleProps {
    operation: BoundLink;
}

@observer
export class BoundLinkAnt extends React.Component<BoundLinkAntProps> {
    render() {
        const { operation, children, ...rest } = this.props;

        if (operation.invisible) {
            return null;
        }

        const linkProps: LinkAntProps = {
            to: operation.to,
            argChanges: operation.argChanges,
            position: operation.position,
            appendTokens: operation.appendTokens,
            removeTokenCount: operation.removeTokenCount,
            label: operation.label,
            ...rest,
        };

        return <LinkAnt {...linkProps}>{children}</LinkAnt>;
    }
}
