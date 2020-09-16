import { inject, observer } from 'mobx-react';
import { NavMenuBarAnt } from '@moxb/antd';
import { UsesLocation, UsesLinkGenerator } from '@moxb/moxb';
import * as React from 'react';

import { mainMenu } from '../MenuStructure';

@inject('linkGenerator')
@observer
export class NavigationAnt extends React.Component<UsesLocation & UsesLinkGenerator> {
    render() {
        return <NavMenuBarAnt id="main-menu" subStates={mainMenu} linkGenerator={this.props.linkGenerator} />;
    }
}
