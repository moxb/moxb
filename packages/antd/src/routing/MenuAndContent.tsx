import * as React from 'react';

import { NavMenuBar, NavMenuProps } from './NavMenuBar';
import { LocationDependentContent, ContentProps } from './LocationDependentContent';

export type UIProps = NavMenuProps & ContentProps;

export class MenuAndContent extends React.Component<UIProps, {}> {
    public render() {
        const {
            locationManager,
            rootPath,
            arg,
            substates,
            condition,
            hierarchical,
            right,
            fallback,
            mountAll,
            debug,
        } = this.props;
        const menuProps: NavMenuProps = {
            locationManager,
            rootPath,
            arg,
            substates,
            condition,
            hierarchical,
            right,
        };
        const contentProps: ContentProps = {
            locationManager,
            rootPath,
            arg,
            substates,
            fallback,
            mountAll,
            debug,
        };
        return (
            <div>
                <NavMenuBar {...menuProps} />
                <LocationDependentContent {...contentProps} />
            </div>
        );
    }
}
