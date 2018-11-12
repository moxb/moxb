import * as React from 'react';
import { Menu } from 'antd';
import { observer, inject } from 'mobx-react';
import {
    SubStateInContext,
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerProps,
    LocationDependentStateSpaceHandlerImpl,
} from '@moxb/moxb';
import * as Anchor from '../not-antd/Anchor';
import { renderUIFragment, UIFragment, UIFragmentSpec } from '../not-antd';

export type NavMenuProps = LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec>;

@inject('locationManager')
@observer
/**
 * This widget show an Ant menu bar, based on the state-space.
 */
export class NavMenuBarAnt extends React.Component<NavMenuProps> {
    protected readonly _id: string;
    protected readonly _states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec>;

    public constructor(props: NavMenuProps) {
        super(props);
        this._renderSubStateLink = this._renderSubStateLink.bind(this);
        this._renderSubStateGroup = this._renderSubStateGroup.bind(this);
        this._renderSubStateElement = this._renderSubStateElement.bind(this);
        const { id, children: _children, ...stateProps } = this.props;
        this._id = id || 'no-id';
        this._states = new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            id: 'menu bar of ' + id,
        });
    }

    protected _renderSubStateLink(state: SubStateInContext<UIFragment, UIFragmentSpec>) {
        const { label, menuKey } = state;
        const url = this._states.getUrlForSubState(state);
        const anchorProps: Anchor.UIProps = {
            label,
            href: url,
            onClick: () => this._states.selectSubState(state),
        };
        return (
            <Menu.Item key={menuKey}>
                <Anchor.Anchor {...anchorProps} />
            </Menu.Item>
        );
    }

    protected _renderSubStateGroup(state: SubStateInContext<UIFragment, UIFragmentSpec>) {
        const { label, key, subStates, flat, menuKey } = state;
        if (!flat && !key) {
            throw new Error("Can't create a hierarchical menu group without a key!");
        }
        return (
            <Menu.SubMenu key={menuKey} title={renderUIFragment(label)}>
                {subStates!.map(this._renderSubStateElement)}
            </Menu.SubMenu>
        );
    }

    protected _renderSubStateElement(state: SubStateInContext<UIFragment, UIFragmentSpec>) {
        const { isGroupOnly } = state;
        return isGroupOnly ? this._renderSubStateGroup(state) : this._renderSubStateLink(state);
    }

    public render() {
        // AndD's Menu is smart enough to automatically indicate active state
        // on all groups, so we only ask for the leaves.
        const selectedMenuKeys = this._states.getActiveSubStateMenuKeys(true);
        return (
            <Menu selectedKeys={selectedMenuKeys} mode="horizontal" style={{ lineHeight: '64px' }}>
                {this._states.getFilteredSubStates().map(this._renderSubStateElement)}
            </Menu>
        );
    }
}
