import * as React from 'react';
import { observer, inject } from 'mobx-react';
import * as Anchor from './Anchor';
import { QueryChange, UrlArg, UsesLocation } from '@moxb/moxb';

interface ArgChange<T> {
    arg: UrlArg<T>;
    value: T;
}

export interface MultiArgChangingLinkParams extends Anchor.AnchorParams {
    changes: ArgChange<any>[];
}

type MultiArgChangingLinkProps = MultiArgChangingLinkParams & Anchor.Events;

@inject('locationManager')
@observer
export class MultiArgChangingLink extends React.Component<MultiArgChangingLinkProps & UsesLocation> {
    public constructor(props: MultiArgChangingLinkProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    protected _getRealChanges(): QueryChange[] {
        return this.props.changes.map(
            (change): QueryChange => ({
                key: change.arg.key,
                value: change.arg.getRawValue(change.value),
            })
        );
    }

    protected handleClick() {
        this.props.locationManager!.setQueries(this._getRealChanges());
    }

    public render() {
        const { locationManager, changes, children, ...remnants } = this.props;
        const url = locationManager!.getURLForQueryChanges(this._getRealChanges());
        const anchorProps: Anchor.UIProps = {
            ...remnants,
            href: url,
            onClick: this.handleClick,
        };
        return <Anchor.Anchor {...anchorProps}>{children}</Anchor.Anchor>;
    }
}
