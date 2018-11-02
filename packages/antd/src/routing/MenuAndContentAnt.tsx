import * as React from 'react';

import { NavMenuBarAnt, NavMenuProps } from './NavMenuBarAnt';
import { LocationDependentContentImpl, LocationDependentContentProps } from '../not-antd';

export type UIProps = NavMenuProps & LocationDependentContentProps;

/**
 * This widget shows an Ant Nav Menu bar, and the corresponding content,
 * based on the state-space and the location.
 */
export class MenuAndContentAnt extends React.Component<UIProps> {
    public render() {
        return (
            <div>
                <NavMenuBarAnt {...this.props} />
                <LocationDependentContentImpl {...this.props} />
            </div>
        );
    }
}
