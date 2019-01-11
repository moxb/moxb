import { NavMenuBarAnt } from '@moxb/antd';
import { UsesLocation } from '@moxb/moxb';
import * as React from 'react';

import { mainMenu } from '../MenuStructure';

export class NavigationAnt extends React.Component<UsesLocation> {
    render() {
        return <NavMenuBarAnt id="main-menu" subStates={mainMenu} />;
    }
}
