import * as React from 'react';
import { observer } from 'mobx-react';

import { LocationManager, UrlArg } from '@moxb/moxb';

import * as ChangingContent from './ChangingContent';
import { ChangingContentImpl } from './ChangingContentImpl';

interface ControlMethod {
    rootPath?: string;
    arg?: UrlArg<string>;
}

type UIProps = ChangingContent.Params &
    ControlMethod & {
        locationManager: LocationManager;
    };

@observer
export class LocationDependentContent extends React.Component<UIProps, {}> {
    public render() {
        const { arg, locationManager, children, ...remnant } = this.props;
        const rawPath: string | string[] = arg ? arg.value : locationManager.pathTokens;
        const props: ChangingContent.Props = {
            ...remnant,
            rawPath,
            debug: false,
        };
        return <ChangingContentImpl {...props} />;
    }
}
