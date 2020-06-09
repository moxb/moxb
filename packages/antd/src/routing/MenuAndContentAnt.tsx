import * as React from 'react';
import { LocationDependentArea, LocationDependentAreaProps } from '../not-antd';

import { NavMenuBarAnt, NavMenuProps } from './NavMenuBarAnt';

export type UIProps<DataType> = NavMenuProps<DataType> & LocationDependentAreaProps<DataType>;

/**
 * This widget shows an Ant Nav Menu bar, and the corresponding content,
 * based on the state-space and the location.
 */
export class MenuAndContentAnt<DataType> extends React.Component<UIProps<DataType>> {
    public render() {
        return (
            <div style={{ width: '100%' }}>
                <NavMenuBarAnt {...this.props} />
                <LocationDependentArea {...this.props} />
            </div>
        );
    }
}
