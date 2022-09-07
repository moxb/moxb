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
import { ItemType as TransformedMenuItem } from 'antd/es/menu/hooks/useItems';

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
    function transformSubStateLink(
        inStates: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, any>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, any>
    ): TransformedMenuItem {
        const { label, key, menuKey, newWindow, linkClassName, linkStyle, noLink, title } = state;
        if (noLink) {
            return {
                key: menuKey,
                label: renderUIFragment(label || key || 'item'),
            };
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
            return {
                key: menuKey,
                label: <Anchor {...anchorProps} />,
            };
        }
    }

    function transformSubStateGroup(
        inStates: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, any>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, any>
    ): TransformedMenuItem {
        const { label, key, subStates, flat, menuKey } = state;
        if (!flat && !key) {
            throw new Error("Can't create a hierarchical menu group without a key!");
        }
        return {
            key: menuKey,
            label: renderUIFragment(label || key || '***'),
            children: subStates!.map((s) => transformSubStateElement(inStates, s)),
        };
    }

    const transformSeparator = (state: SubStateInContext<UIFragment, UIFragmentSpec, any>): TransformedMenuItem => ({
        type: 'divider',
        key: state.menuKey,
    });

    function transformSubStateElement(
        inStates: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, any>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, any>
    ): TransformedMenuItem {
        const { isGroupOnly, separator } = state;
        return separator
            ? transformSeparator(state)
            : isGroupOnly
            ? transformSubStateGroup(inStates, state)
            : transformSubStateLink(inStates, state);
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

    const subStatesToShow = states.getFilteredSubStates({
        onlyVisible: true,
        onlySatisfying: true,
    });
    const menuItems: TransformedMenuItem[] = subStatesToShow.map((state) => transformSubStateElement(states, state));
    return (
        <span style={{ display: 'flex' }}>
            <Menu
                triggerSubMenuAction={triggerSubMenuAction}
                selectedKeys={selectedMenuKeys}
                // defaultOpenKeys={defaultOpenKeys}
                {...openProps}
                mode={mode}
                style={actualStyle}
                items={menuItems}
            />
            {!!extras.length && (
                <div
                    style={{
                        display: 'flex',
                        padding: '0 20px',
                        alignItems: 'center',
                    }}
                >
                    {extras.map((extra, index) => (
                        <span key={`extra-${index}`}>{renderUIFragment(extra)}</span>
                    ))}
                </div>
            )}
        </span>
    );
});
