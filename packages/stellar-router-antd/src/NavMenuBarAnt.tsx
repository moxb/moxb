import { idToDomId } from '@moxb/moxb';
import { renderUIFragment, UIFragment, UIFragmentSpec, Anchor, AnchorProps } from '@moxb/react-html';
import {
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    SubStateInContext,
    useLocationManager,
    useLinkGenerator,
} from '@moxb/stellar-router-react';
import { Menu } from 'antd';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { MenuMode, TriggerSubMenuAction } from 'rc-menu/lib/interface';

export interface NavMenuProps<DataType>
    extends Omit<
        LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType>,
        'linkGenerator' | 'locationManager'
    > {
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

    /**
     * Any children to render
     */
    children?: React.ReactNode;
}

/**
 * This widget show an Ant menu bar, based on the state-space.
 */
export const NavMenuBarAnt = observer((props: NavMenuProps<any>) => {
    const linkGenerator = useLinkGenerator();
    const locationManager = useLocationManager('nav menu bar ' + props.id);

    function getLocationDependantStateSpaceHandler(): LocationDependentStateSpaceHandler<
        UIFragment,
        UIFragmentSpec,
        any
    > {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, children: _children, extras: _extras, style: _style, mode: _mode, ...stateProps } = props;

        return new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            locationManager,
            linkGenerator,
            id: 'menu bar of ' + (props.id || 'no-id'),
        });
    }

    // eslint-disable-next-line complexity
    function renderSubStateLink(
        inStates: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, any>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, any>
    ) {
        const { label, key, menuKey, newWindow, itemClassName, linkClassName, linkStyle, noLink, title } = state;
        // use `.` to separate the items and the convert it to a DOM id (which converts all . to -)
        const itemId = idToDomId('menuItem.' + props.id + '.' + menuKey);
        const itemProps: any = {};
        if (noLink) {
            return (
                <Menu.Item data-testid={itemId} id={itemId} key={menuKey} {...itemProps}>
                    {renderUIFragment(label || key || 'item')}
                </Menu.Item>
            );
        } else {
            const url = inStates.getUrlForSubState(state);
            const anchorProps: AnchorProps = {
                label: label || key,
                href: url,
                target: newWindow ? '_blank' : undefined,
                onClick: newWindow ? undefined : () => inStates.trySelectSubState(state),
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
                    <Anchor {...anchorProps} />
                </Menu.Item>
            );
        }
    }

    function renderSubStateGroup(
        inStates: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, any>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, any>
    ) {
        const { label, key, subStates, flat, menuKey, linkStyle, itemClassName } = state;
        if (!flat && !key) {
            throw new Error("Can't create a hierarchical menu group without a key!");
        }
        const itemId = idToDomId('menuItem.' + props.id + '.' + menuKey);
        return (
            <Menu.SubMenu
                data-testid={itemId}
                key={menuKey}
                className={itemClassName}
                title={renderUIFragment(label || key || '***')}
                style={linkStyle}
            >
                {subStates!.map((s) => renderSubStateElement(inStates, s))}
            </Menu.SubMenu>
        );
    }

    function renderSeparator(state: SubStateInContext<UIFragment, any, any>) {
        return <Menu.Divider key={state.menuKey} />;
    }

    function renderSubStateElement(
        inStates: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, any>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, any>
    ) {
        const { isGroupOnly, separator } = state;
        return separator
            ? renderSeparator(state)
            : isGroupOnly
            ? renderSubStateGroup(inStates, state)
            : renderSubStateLink(inStates, state);
    }

    const states = getLocationDependantStateSpaceHandler();
    // AndD's Menu is smart enough to automatically indicate active state
    // on all groups, so we only ask for the leaves.
    const selectedMenuKeys = states.getActiveSubStateMenuKeys(true);
    const { extras = [], style, mode = 'horizontal', triggerSubMenuAction, openGroups = 'default' } = props;
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
                .map((state) => renderSubStateElement(states, state))}
            {extras.map((f) => renderUIFragment(f))}
        </Menu>
    );
});
