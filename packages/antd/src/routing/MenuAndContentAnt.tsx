import * as React from 'react';

import { NavMenuBarAnt, NavMenuProps } from './NavMenuBarAnt';
import { LocationDependentArea, LocationDependentAreaProps } from '../not-antd';

export type UIProps<DataType> = NavMenuProps<DataType> & LocationDependentAreaProps<DataType>;

/**
 * This widget shows an Ant Nav Menu bar, and the corresponding content,
 * based on the state-space and the location.
 */
export class MenuAndContentAnt<DataType> extends React.Component<UIProps<DataType>> {
    public render() {
        return (
            <div>
                <NavMenuBarAnt {...this.props} />
                <LocationDependentArea {...this.props} />
            </div>
        );
    }
}
