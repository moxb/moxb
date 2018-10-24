import * as React from 'react';
import { observer } from 'mobx-react';

import { LocationManager, UrlArg } from '@moxb/moxb';

import { ChangingContentParams, ChangingContentProps } from './ChangingContent';
import { ChangingContentImpl } from './ChangingContentImpl';

interface ControlMethod {
    parsedTokens?: number;
    arg?: UrlArg<string>;
}

export interface ContentProps extends ChangingContentParams, ControlMethod {
    locationManager: LocationManager;
}

@observer
export class LocationDependentContent extends React.Component<ContentProps, {}> {
    public render() {
        const { arg, locationManager, children, ...remnant } = this.props;
        const tokens: string[] = arg ? [arg.value] : locationManager.pathTokens;
        if (remnant.debug) {
            console.log('arg is', arg);
            console.log('tokens are', tokens);
        }
        const props: ChangingContentProps = {
                ...remnant,
            tokens,
        };
        return <ChangingContentImpl {...props} />;
    }
}
