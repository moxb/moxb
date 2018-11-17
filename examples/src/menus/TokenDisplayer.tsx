import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { UsesLocation, Navigable, getNextPathToken, getParsedPathTokens } from '@moxb/moxb';
import { UIFragmentSpec } from '@moxb/antd';

@inject('locationManager')
@observer
export class TokenDisplayer extends React.Component<Navigable<any, UIFragmentSpec> & UsesLocation> {
    public render() {
        return (
            <div>
                <div>
                    We are at <b>{getParsedPathTokens(this.props).join(' / ')}</b>
                </div>
                <div>
                    Next token this <b>{getNextPathToken(this.props)}</b>
                </div>
            </div>
        );
    }
}
