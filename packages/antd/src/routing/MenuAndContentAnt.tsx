import * as React from 'react';

import { NavMenuBarAnt, NavMenuProps } from './NavMenuBarAnt';
import { LocationDependentContent, ContentProps } from '../not-antd/LocationDependentContent';

export type UIProps = NavMenuProps & ContentProps;

export class MenuAndContentAnt extends React.Component<UIProps, {}> {
    public render() {
        return (
            <div>
                <NavMenuBarAnt {...this.props} />
                <LocationDependentContent {...this.props} />
            </div>
        );
    }
}
