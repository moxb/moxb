import * as React from 'react';
import { observer, inject } from 'mobx-react';

import { UsesLocation, Navigable, UrlArg } from '@moxb/moxb';

import { ChangingContentParams, ChangingContentProps } from './ChangingContent';
import { ChangingContentImpl } from './ChangingContentImpl';

export interface ContentProps extends ChangingContentParams, Navigable {
    arg?: UrlArg<string>;
}

@inject('locationManager')
@observer
export class LocationDependentContent extends React.Component<ContentProps & UsesLocation> {
    public render() {
        const { arg, locationManager, children, ...remnant } = this.props;
        const currentTokens: string[] = arg ? [arg.value] : locationManager!.pathTokens;
        if (remnant.debug) {
            console.log('arg is', arg);
            console.log('current tokens are', currentTokens);
        }
        const props: ChangingContentProps = {
            ...remnant,
            currentTokens,
        };
        return <ChangingContentImpl {...props}>{children}</ChangingContentImpl>;
    }
}
