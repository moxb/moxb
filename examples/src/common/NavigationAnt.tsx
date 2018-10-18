import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { NavMenuBar } from '@moxb/antd';

import { mainMenu, missingContent } from '../MenuStructure.tsx';

@inject('location')
export class NavigationAnt extends React.Component<{ location?: LocationManager }> {
    render() {
        return <NavMenuBar locationManager={this.props.location} substates={mainMenu} />;
    }
}
