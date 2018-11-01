import * as React from 'react';

import { NavMenuBarAnt, NavMenuProps } from './NavMenuBarAnt';
import { LocationDependentContent, ContentProps } from '../not-antd/LocationDependentContent';

export type UIProps = NavMenuProps & ContentProps;

/**
 * This widget shows an Ant menu base, and the corresponding content, based on a state-space.
 */
export class MenuAndContentAnt extends React.Component<UIProps> {
    public render() {
        return (
            <div>
                <NavMenuBarAnt {...this.props} />
                <LocationDependentContent {...this.props} />
            </div>
        );
    }
}
