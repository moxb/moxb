import * as React from 'react';
import { Menu } from 'antd';
import { observer, inject } from 'mobx-react';
import {
    SubStateInContext,
    StateSpaceAndLocationHandler,
    StateSpaceAndLocationHandlerProps,
    StateSpaceAndLocationHandlerImpl,
} from '@moxb/moxb';
import { Link } from '../not-antd';

import { renderFragment } from '@moxb/moxb';
import { ArgChangingLink } from '../not-antd';

export interface NavMenuProps extends StateSpaceAndLocationHandlerProps {
    /**
     * An ID, used mostly for debugging
     */
    id?: string;
}

@inject('locationManager')
@observer
export class NavMenuBarAnt extends React.Component<NavMenuProps> {
    protected readonly _id: string;
    protected readonly _states: StateSpaceAndLocationHandler;

    public constructor(props: NavMenuProps) {
        super(props);
        this.renderSubStateLink = this.renderSubStateLink.bind(this);
        const { id, children: _children, ...stateProps } = this.props;
        this._id = id || 'no-id';
        this._states = new StateSpaceAndLocationHandlerImpl({
            ...stateProps,
            id,
        });
    }

    protected renderSubStateLink(state: SubStateInContext, parentPathTokens: string[] = []) {
        const { arg } = this.props;
        const { label, key, root, subStates, menuKey } = state;
        const { parsedTokens } = this.props;
        return subStates ? (
            this.renderSubStateLinkGroup(state)
        ) : arg ? (
            <Menu.Item key={menuKey}>
                <ArgChangingLink arg={arg} value={key} label={label} />
            </Menu.Item>
        ) : (
            <Menu.Item key={menuKey}>
                <Link position={parsedTokens} pathTokens={[...parentPathTokens, root ? '' : key!]} label={label} />
            </Menu.Item>
        );
    }

    protected renderSubStateLinkGroup(state: SubStateInContext, parentPathTokens: string[] = []) {
        const { label, key, subStates, hierarchical, menuKey } = state;
        if (hierarchical && !key) {
            throw new Error("Can't create a hierarchical menu group without a key!");
        }
        const tokens = hierarchical ? [...parentPathTokens, key!] : parentPathTokens;
        return (
            <Menu.SubMenu key={menuKey} title={renderFragment(label)}>
                {subStates!.map(s => this.renderSubStateLink(s, tokens))}
            </Menu.SubMenu>
        );
    }

    public render() {
        const selectedMenuKeys = this._states.getActiveSubStateMenuKeys();
        // console.log('Selected keys for', this._id, ':', selectedMenuKeys);
        return (
            <Menu selectedKeys={selectedMenuKeys} mode="horizontal" style={{ lineHeight: '64px' }}>
                {this._states.getFilteredSubStates().map(s => this.renderSubStateLink(s, []))}
            </Menu>
        );
    }
}
