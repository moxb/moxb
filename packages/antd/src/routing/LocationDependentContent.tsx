import * as React from 'react';
import { observer } from 'mobx-react';

import { LocationManager, UrlArg } from '@moxb/moxb';

import * as ChangingContent from './ChangingContent';
import { ChangingContentImpl } from './ChangingContentImpl';

interface ControlMethod {
    rootPath?: string;
    arg?: UrlArg<string>;
}

export interface ContentProps extends ChangingContent.Params, ControlMethod {
    locationManager: LocationManager;
}

@observer
export class LocationDependentContent extends React.Component<ContentProps, {}> {
    public render() {
        const { arg, locationManager, children, ...remnant } = this.props;
        const rawPath: string | string[] = arg ? arg.value : locationManager.pathTokens;
        if (remnant.debug) {
            console.log("arg is", arg);
            console.log("rawPath is", rawPath);
        }
        const props: ChangingContent.Props = {
            ...remnant,
            rawPath,
            separator: locationManager.pathSeparator,
        };
        return <ChangingContentImpl {...props} />;
    }
}
