import {
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    SubStateInContext,
} from '@moxb/moxb';
import { Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { renderUIFragment, UIFragment, UIFragmentSpec } from '../not-antd';
import * as Anchor from '../not-antd/Anchor';

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

    /**
     * Menu alignment mode. (Default is 'horizontal')
     */
    mode?: 'vertical' | 'vertical-left' | 'vertical-right' | 'horizontal' | 'inline';
}

@inject('locationManager')
@observer
/**
 * This widget show an Ant menu bar, based on the state-space.
 */
export class NavMenuBarAnt<DataType> extends React.Component<NavMenuProps<DataType>> {
    protected getLocationDependantStateSpaceHandler() {
        const { id, children: _children, extras, style, mode, ...stateProps } = this.props;

        return new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            id: 'menu bar of ' + (this.props.id || 'no-id'),
        });
    }

    // tslint:disable-next-line:cyclomatic-complexity
    protected renderSubStateLink(
        states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>
    ) {
        const { label, key, menuKey, newWindow, itemClassName, linkClassName, linkStyle, noLink, title } = state;
        if (noLink) {
            return <Menu.Item key={menuKey}>{renderUIFragment(label || key || 'item')}</Menu.Item>;
        } else {
            const url = states.getUrlForSubState(state);
            const anchorProps: Anchor.UIProps = {
                label: label || key,
                href: url,
                target: newWindow ? '_blank' : undefined,
                onClick: newWindow ? undefined : () => states.trySelectSubState(state),
                style: linkStyle,
                title,
            };
            if (linkClassName) {
                anchorProps.className = linkClassName;
            }
            const itemProps: any = {};
            if (itemClassName) {
                itemProps.className = itemClassName;
            }
            return (
                <Menu.Item key={menuKey} {...itemProps}>
                    <Anchor.Anchor {...anchorProps} />
                </Menu.Item>
            );
        }
    }

    protected renderSubStateGroup(
        states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>
    ) {
        const { label, key, subStates, flat, menuKey, linkStyle } = state;
        if (!flat && !key) {
            throw new Error("Can't create a hierarchical menu group without a key!");
        }
        return (
            <Menu.SubMenu key={menuKey} title={renderUIFragment(label || key || '***')} style={linkStyle}>
                {subStates!.map(s => this.renderSubStateElement(states, s))}
            </Menu.SubMenu>
        );
    }

    protected renderSubStateElement(
        states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>
    ) {
        const { isGroupOnly } = state;
        return isGroupOnly ? this.renderSubStateGroup(states, state) : this.renderSubStateLink(states, state);
    }

    public render() {
        const states = this.getLocationDependantStateSpaceHandler();
        // AndD's Menu is smart enough to automatically indicate active state
        // on all groups, so we only ask for the leaves.
        const selectedMenuKeys = states.getActiveSubStateMenuKeys(true);
        const { extras, style, mode } = this.props;
        return (
            <Menu selectedKeys={selectedMenuKeys} mode={mode || 'horizontal'} style={style}>
                {states
                    .getFilteredSubStates({
                        onlyVisible: true,
                        onlySatisfying: true,
                    })
                    .map(state => this.renderSubStateElement(states, state))}
                {...extras || []}
            </Menu>
        );
    }
}
