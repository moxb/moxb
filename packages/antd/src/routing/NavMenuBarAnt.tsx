import * as React from 'react';
import { Menu } from 'antd';
import { observer, inject } from 'mobx-react';
import {
    StateSpaceAndLocationHandler,
    StateSpaceAndLocationHandlerProps,
    StateSpaceAndLocationHandlerImpl,
} from '@moxb/moxb';
import { Link } from '../not-antd';

import { SubState, renderFragment, SubStateKeyGenerator, SubStateKeyGeneratorImpl } from '@moxb/moxb';
import { ArgChangingLink } from '../not-antd';

export interface NavMenuProps extends StateSpaceAndLocationHandlerProps {
    /**
     * An ID, used mostly for debugging
     */
    id?: string;

    /**
     * A sub-state key generator instance to use, for addressing sub-states
     */
    keyGen?: SubStateKeyGenerator;
}

@inject('locationManager')
@observer
export class NavMenuBarAnt extends React.Component<NavMenuProps> {
    protected readonly _id: string;
    protected readonly _keyGen: SubStateKeyGenerator;
    protected readonly _states: StateSpaceAndLocationHandler;

    public constructor(props: NavMenuProps) {
        super(props);
        this.renderSubStateLink = this.renderSubStateLink.bind(this);
        this._keyGen = props.keyGen || new SubStateKeyGeneratorImpl();
        const { id, children: _children, ...stateProps } = this.props;
        this._id = id || 'no-id';
        this._states = new StateSpaceAndLocationHandlerImpl({
            ...stateProps,
            keyGen: this._keyGen,
            id,
        });
    }

    protected renderSubStateLink(state: SubState, parentPathTokens: string[] = []) {
        const { arg } = this.props;
        const { label, key, root, subStates } = state;
        const { parsedTokens } = this.props;
        const menuKey = this._keyGen.getKey(parentPathTokens, state);
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

    protected renderSubStateLinkGroup(state: SubState, parentPathTokens: string[] = []) {
        const { label, key, subStates, hierarchical } = state;
        if (hierarchical && !key) {
            throw new Error("Can't create a hierarchical menu group without a key!");
        }
        const menuKey = this._keyGen.getKey(parentPathTokens, state);
        const tokens = hierarchical ? [...parentPathTokens, key!] : parentPathTokens;
        return (
            <Menu.SubMenu key={menuKey} title={renderFragment(label)}>
                {subStates!.map(s => this.renderSubStateLink(s, tokens))}
            </Menu.SubMenu>
        );
    }

    public render() {
        const selectedKeys = this._states.getActiveSubStateKeys();
        return (
            <Menu selectedKeys={selectedKeys} mode="horizontal" style={{ lineHeight: '64px' }}>
                {this._states.getFilteredSubStates().map(s => this.renderSubStateLink(s, []))}
            </Menu>
        );
    }
}
