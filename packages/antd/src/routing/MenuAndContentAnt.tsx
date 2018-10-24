import * as React from 'react';

import { NavMenuBarAnt, NavMenuProps } from './NavMenuBarAnt';
import { LocationDependentContent, ContentProps } from '../not-antd/LocationDependentContent';

export type UIProps = NavMenuProps & ContentProps;

export class MenuAndContentAnt extends React.Component<UIProps, {}> {
    public render() {
        const {
            locationManager,
            arg,
            parsedTokens,
            substates,
            filterCondition,
            hierarchical,
            right,
            fallback,
            mountAll,
            debug,
        } = this.props;
        const menuProps: NavMenuProps = {
            locationManager,
            parsedTokens,
            arg,
            substates,
            filterCondition,
            hierarchical,
            right,
        };
        const contentProps: ContentProps = {
            locationManager,
            parsedTokens,
            arg,
            substates,
            fallback,
            mountAll,
            debug,
        };
        return (
            <div>
                <NavMenuBarAnt {...menuProps} />
                <LocationDependentContent {...contentProps} />
            </div>
        );
    }
}
