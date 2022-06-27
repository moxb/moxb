import * as React from 'react';
import { LocationDependentArea, LocationDependentAreaProps } from '@moxb/stellar-router-react';

import { NavMenuBarAnt, NavMenuProps } from './NavMenuBarAnt';

export type UIProps<DataType> = NavMenuProps<DataType> & LocationDependentAreaProps<DataType>;

/**
 * This widget shows an Ant Nav Menu bar, and the corresponding content,
 * based on the state-space and the location.
 */
export const MenuAndContentAnt = (props: UIProps<unknown>) => (
    <div style={{ width: '100%' }}>
        <NavMenuBarAnt {...props} />
        <LocationDependentArea {...props} />
    </div>
);
