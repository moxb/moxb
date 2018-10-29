import * as React from 'react';
import { Menu } from 'antd';
import { observer, inject } from 'mobx-react';
import {
    StateSpaceAndLocationHandler,
    StateSpaceAndLocationHandlerProps,
    StateSpaceAndLocationHandlerImpl,
} from '@moxb/moxb';
import { Link } from '../not-antd';

import { SubState, renderFragment } from '@moxb/moxb';
import { ArgChangingLink } from '../not-antd';

export interface NavMenuProps extends StateSpaceAndLocationHandlerProps {
    hierarchical?: boolean;
    right?: boolean;
}

@inject('locationManager')
@observer
export class NavMenuBarAnt extends React.Component<NavMenuProps> {
    private readonly _states: StateSpaceAndLocationHandler;

    public constructor(props: NavMenuProps) {
        super(props);
        this.renderSubStateLink = this.renderSubStateLink.bind(this);
        this._states = new StateSpaceAndLocationHandlerImpl(props);
    }

    protected renderSubStateLinkGroup(state: SubState) {
        const { label, key, subStates } = state;
        return (
            <Menu.SubMenu key={key} title={renderFragment(label)}>
                {subStates!.map(this.renderSubStateLink)}
            </Menu.SubMenu>
        );

        /*
            <NavLinkGroup
                rootPath={ rootPath }
                path={ toPath }
                hierarchical={ hierarchical }
                label={ label }
                subStates= { subStates }
                condition={ condition }
                right={ right }
            />
            */
    }

    protected renderSubStateLink(state: SubState) {
        const { arg } = this.props;
        const { label, key, root, subStates } = state;
        const { parsedTokens } = this.props;
        return subStates ? (
            this.renderSubStateLinkGroup(state)
        ) : arg ? (
            <Menu.Item key={root ? '_root_' : key}>
                <ArgChangingLink arg={arg} value={key} label={label} />
            </Menu.Item>
        ) : (
            <Menu.Item key={root ? '_root_' : key}>
                <Link position={parsedTokens} pathTokens={[root ? '' : key!]} label={label} />
            </Menu.Item>
        );
    }

    public render() {
        const selectedKeys = this._states.getActiveSubStateKeys();
        //        console.log("Selected keys are", selectedKeys);
        return (
            <Menu selectedKeys={selectedKeys} mode="horizontal" style={{ lineHeight: '64px' }}>
                {this._states.getFilteredSubStates().map(this.renderSubStateLink)}
            </Menu>
        );
    }
}
