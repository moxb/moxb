import * as React from 'react';
import { Menu } from 'antd';

import { NavMenuBar, NavMenuProps } from "./NavMenuBar";
import { LocationDependentContent, ContentProps } from "./LocationDependentContent";

import { SubState, StateSpace, LocationManager, UIFragment, renderFragment } from '@moxb/moxb';

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
            debug
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
                <NavMenuBar {... menuProps } />
                <LocationDependentContent { ... contentProps } />
            </div>
        );
    }
}
