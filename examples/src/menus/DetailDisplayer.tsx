import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { UsesLocation, Navigable, getParsedPathTokens } from '@moxb/moxb';
import { DetailProps } from '@moxb/antd';

@inject('locationManager')
@observer
export class DetailDisplayer extends React.Component<Navigable & UsesLocation & DetailProps> {
    public render() {
        return (
            <div>
                <div>
                    We are at <b>{getParsedPathTokens(this.props).join(' / ')}</b>
                </div>
                <div>
                    Displaying content for token <b>{this.props.token}</b>
                </div>
            </div>
        );
    }
}
