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

export interface NavMenuProps<DataType>
    extends LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType> {
    /**
     * Any extra menu items to add
     */
    extras?: JSX.Element[];

    /**
     * Any direct styles to apply
     */
    style?: React.CSSProperties;
}

@inject('locationManager')
@observer
/**
 * This widget show an Ant menu bar, based on the state-space.
 */
export class NavMenuBarAnt<DataType> extends React.Component<NavMenuProps<DataType>> {
    protected readonly _id: string;
    protected readonly _states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>;

    public constructor(props: NavMenuProps<DataType>) {
        super(props);
        this._renderSubStateLink = this._renderSubStateLink.bind(this);
        this._renderSubStateGroup = this._renderSubStateGroup.bind(this);
        this._renderSubStateElement = this._renderSubStateElement.bind(this);
        const { id, children: _children, extras, style, ...stateProps } = this.props;
        this._id = id || 'no-id';
        this._states = new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            id: 'menu bar of ' + id,
        });
    }

    protected _renderSubStateLink(state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>) {
        const { label, key, menuKey, newWindow, linkClassName } = state;
        const url = this._states.getUrlForSubState(state);
        const anchorProps: Anchor.UIProps = {
            label: label || key,
            href: url,
            target: newWindow ? '_blank' : undefined,
            onClick: newWindow ? undefined : () => this._states.selectSubState(state),
            className: linkClassName,
        };
        return (
            <Menu.Item key={menuKey}>
                <Anchor.Anchor {...anchorProps} />
            </Menu.Item>
        );
    }

    protected _renderSubStateGroup(state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>) {
        const { label, key, subStates, flat, menuKey } = state;
        if (!flat && !key) {
            throw new Error("Can't create a hierarchical menu group without a key!");
        }
        return (
            <Menu.SubMenu key={menuKey} title={renderUIFragment(label || key || '***')}>
                {subStates!.map(this._renderSubStateElement)}
            </Menu.SubMenu>
        );
    }

    protected _renderSubStateElement(state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>) {
        const { isGroupOnly } = state;
        return isGroupOnly ? this._renderSubStateGroup(state) : this._renderSubStateLink(state);
    }

    public render() {
        // AndD's Menu is smart enough to automatically indicate active state
        // on all groups, so we only ask for the leaves.
        const selectedMenuKeys = this._states.getActiveSubStateMenuKeys(true);
        const { extras, style } = this.props;
        return (
            <Menu selectedKeys={selectedMenuKeys} mode="horizontal" style={style}>
                {this._states
                    .getFilteredSubStates({
                        onlyVisible: true,
                        onlySatisfying: true,
                    })
                    .map(this._renderSubStateElement)}
                {...extras || []}
            </Menu>
        );
    }
}
