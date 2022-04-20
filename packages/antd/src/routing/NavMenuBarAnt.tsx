import {
    idToDomId,
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    SubStateInContext,
} from '@moxb/moxb';
import { renderUIFragment, UIFragment, UIFragmentSpec } from '@moxb/html';
import { Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as Anchor from '@moxb/html/dist/Anchor';
import { MenuMode, TriggerSubMenuAction } from 'rc-menu/lib/interface';

export interface NavMenuProps<DataType>
    extends LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType> {
    /**
     * Any extra menu items to add
     */
    extras?: UIFragment[];

    /**
     * Any direct styles to apply
     */
    style?: React.CSSProperties;

    /**
     * Menu alignment mode.
     *
     * Valid values are "horizontal", "vertical", "inline".
     * (Default is 'horizontal')
     */
    mode?: MenuMode;

    /**
     * What triggers sub-menus to open?
     *
     * Valid values are "hover" (the default) and "click".
     */
    triggerSubMenuAction?: TriggerSubMenuAction;

    /**
     * In case of an inline menu, how do we decide about which groups are open and closed?
     */
    openGroups?: 'force-closed' | 'start-closed' | 'default' | 'start-open' | 'force-open';
}

@inject('locationManager')
@observer
/**
 * This widget show an Ant menu bar, based on the state-space.
 */
export class NavMenuBarAnt<DataType> extends React.Component<NavMenuProps<DataType>> {
    protected getLocationDependantStateSpaceHandler(): LocationDependentStateSpaceHandler<
        UIFragment,
        UIFragmentSpec,
        DataType
    > {
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
        // use `.` to separate the items and the convert it to a DOM id (which converts all . to -)
        const itemId = idToDomId('menuItem.' + this.props.id + '.' + menuKey);
        const itemProps: any = {};
        if (noLink) {
            return (
                <Menu.Item data-testid={itemId} id={itemId} key={menuKey} {...itemProps}>
                    {renderUIFragment(label || key || 'item')}
                </Menu.Item>
            );
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
            if (itemClassName) {
                itemProps.className = itemClassName;
            }
            return (
                <Menu.Item data-testid={itemId} id={itemId} key={menuKey} {...itemProps}>
                    <Anchor.Anchor {...anchorProps} />
                </Menu.Item>
            );
        }
    }

    protected renderSubStateGroup(
        states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>
    ) {
        const { label, key, subStates, flat, menuKey, linkStyle, itemClassName } = state;
        if (!flat && !key) {
            throw new Error("Can't create a hierarchical menu group without a key!");
        }
        const itemId = idToDomId('menuItem.' + this.props.id + '.' + menuKey);
        return (
            <Menu.SubMenu
                data-testid={itemId}
                key={menuKey}
                className={itemClassName}
                title={renderUIFragment(label || key || '***')}
                style={linkStyle}
            >
                {subStates!.map((s) => this.renderSubStateElement(states, s))}
            </Menu.SubMenu>
        );
    }

    protected renderSeparator(state: SubStateInContext<UIFragment, any, any>) {
        return <Menu.Divider key={state.menuKey} />;
    }

    protected renderSubStateElement(
        states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>
    ) {
        const { isGroupOnly, separator } = state;
        return separator
            ? this.renderSeparator(state)
            : isGroupOnly
            ? this.renderSubStateGroup(states, state)
            : this.renderSubStateLink(states, state);
    }

    public render() {
        const states = this.getLocationDependantStateSpaceHandler();
        // AndD's Menu is smart enough to automatically indicate active state
        // on all groups, so we only ask for the leaves.
        const selectedMenuKeys = states.getActiveSubStateMenuKeys(true);
        const { extras = [], style, mode = 'horizontal', triggerSubMenuAction, openGroups = 'default' } = this.props;
        const actualStyle: React.CSSProperties = { ...style };
        if (mode === 'horizontal') {
            actualStyle.width = '100%';
        }
        const openProps: {
            openKeys?: string[];
            defaultOpenKeys?: string[];
        } = {};
        if (mode === 'inline') {
            const groupKeys = states._subStatesInContext.filter((s) => !!s.subStates).map((s) => s.menuKey);
            switch (openGroups) {
                case 'force-closed':
                    openProps.openKeys = [];
                    break;
                case 'start-closed':
                    openProps.defaultOpenKeys = [];
                    break;
                case 'default':
                    break;
                case 'start-open':
                    openProps.defaultOpenKeys = groupKeys;
                    break;
                case 'force-open':
                    openProps.openKeys = groupKeys;
            }
        }

        return (
            <Menu
                triggerSubMenuAction={triggerSubMenuAction}
                selectedKeys={selectedMenuKeys}
                // defaultOpenKeys={defaultOpenKeys}
                {...openProps}
                mode={mode}
                style={actualStyle}
            >
                {states
                    .getFilteredSubStates({
                        onlyVisible: true,
                        onlySatisfying: true,
                    })
                    .map((state) => this.renderSubStateElement(states, state))}
                {extras.map((f) => renderUIFragment(f))}
            </Menu>
        );
    }
}
