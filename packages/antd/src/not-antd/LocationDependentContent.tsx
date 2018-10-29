import * as React from 'react';
import { observer, inject } from 'mobx-react';

import { UsesLocation, Navigable, UrlArg } from '@moxb/moxb';

import { ChangingContentParams, ChangingContentProps } from './ChangingContent';
import { ChangingContentImpl } from './ChangingContentImpl';

/*
 Changing content can be controlled by two different means:
 
 1. Url path
 2. Url arguments

 For each mode, different properties need to be specified.
 See below for details
*/

export interface ContentProps extends ChangingContentParams, Navigable {
    arg?: UrlArg<string>;
}

@inject('locationManager')
@observer
export class LocationDependentContent extends React.Component<ContentProps & UsesLocation> {
    public render() {
        const { arg, locationManager, children, ...remnant } = this.props;
        const tokens: string[] = arg ? [arg.value] : locationManager!.pathTokens;
        if (remnant.debug) {
            console.log('arg is', arg);
            console.log('tokens are', tokens);
        }
        const props: ChangingContentProps = {
            ...remnant,
            tokens,
        };
        return <ChangingContentImpl {...props}>{children}</ChangingContentImpl>;
    }
}
