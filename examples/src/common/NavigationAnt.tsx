import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { NavMenuBarAnt } from '@moxb/antd';

import { mainMenu, missingContent } from '../MenuStructure.tsx';

@inject('location')
export class NavigationAnt extends React.Component<{ location?: LocationManager }> {
    render() {
        return <NavMenuBarAnt locationManager={this.props.location} substates={mainMenu} />;
    }
}
