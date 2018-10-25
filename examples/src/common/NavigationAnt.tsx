import * as React from 'react';
import { NavMenuBarAnt } from '@moxb/antd';

import { mainMenu } from '../MenuStructure';
import { UsesLocation } from '@moxb/moxb';

export class NavigationAnt extends React.Component<UsesLocation> {
    render() {
        return <NavMenuBarAnt substates={mainMenu} />;
    }
}
