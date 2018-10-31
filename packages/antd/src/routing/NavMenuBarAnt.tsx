import * as React from 'react';
import { Menu } from 'antd';
import { observer, inject } from 'mobx-react';
import {
    SubStateInContext,
    StateSpaceAndLocationHandler,
    StateSpaceAndLocationHandlerProps,
    StateSpaceAndLocationHandlerImpl,
} from '@moxb/moxb';
import * as Anchor from '../not-antd/Anchor';

import { renderFragment } from '@moxb/moxb';

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
        this._renderSubStateLink = this._renderSubStateLink.bind(this);
        this._renderSubStateGroup = this._renderSubStateGroup.bind(this);
        this._renderSubStateElement = this._renderSubStateElement.bind(this);
        const { id, children: _children, ...stateProps } = this.props;
        this._id = id || 'no-id';
        this._states = new StateSpaceAndLocationHandlerImpl({
            ...stateProps,
            id,
        });
    }

    protected _renderSubStateLink(state: SubStateInContext) {
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

    protected _renderSubStateGroup(state: SubStateInContext) {
        const { label, key, subStates, hierarchical, menuKey } = state;
        if (hierarchical && !key) {
            throw new Error("Can't create a hierarchical menu group without a key!");
        }
        return (
            <Menu.SubMenu key={menuKey} title={renderFragment(label)}>
                {subStates!.map(this._renderSubStateElement)}
            </Menu.SubMenu>
        );
    }

    protected _renderSubStateElement(state: SubStateInContext) {
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
