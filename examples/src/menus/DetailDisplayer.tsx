import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { UsesLocation, Navigable, getParsedPathTokens } from '@moxb/moxb';
import { UIFragmentSpec } from '@moxb/antd';
import { UsesURL } from '../store/UrlStore';

@inject('locationManager', 'url')
@observer
export class DetailDisplayer extends React.Component<Navigable<any, UIFragmentSpec> & UsesLocation & UsesURL> {
    public render() {
        return (
            <div>
                <div>
                    We are at <b>{getParsedPathTokens(this.props).join(' / ')}</b>
                </div>
                <div>
                    Displaying content for topic <b>{this.props.url!.something.value}</b>
                </div>
            </div>
        );
    }
}
