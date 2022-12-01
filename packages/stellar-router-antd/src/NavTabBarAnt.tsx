import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Tabs } from 'antd';
import { Tab as TransformedMenuItem } from 'rc-tabs/lib/interface';

import { idToDomId } from '@moxb/util';
import {
    extractUIFragmentFromSpec,
    renderUIFragment,
    Anchor,
    AnchorProps,
    UIFragment,
    UIFragmentSpec,
} from '@moxb/react-html';
import {
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    SubStateInContext,
    renderSubStateCore,
    useLocationManager,
    useTokenManager,
} from '@moxb/stellar-router-react';

const NOT_FOUND = '_not_found_404';

export interface NavTabProps<DataType>
    extends Omit<
        LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType>,
        'locationManager' | 'tokenManager'
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
     * Tab bar alignment mode
     */
    mode?: 'top' | 'right' | 'bottom' | 'left';

    children?: React.ReactNode;
}

/**
 * This widget show an Ant tab bar, based on the state-space.
 */
export const NavTabBarAnt = observer((props: NavTabProps<unknown>) => {
    const locationManager = useLocationManager('NavTabBarAnt for ' + props.id);
    const tokenManager = useTokenManager();

    function getLocationDependantStateSpaceHandler() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, children: _children, extras: _extras, style: _style, mode: _mode, ...stateProps } = props;

        return new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            locationManager,
            tokenManager,
            id: 'tab bar of ' + (_id || 'no-id'),
            intercept: true,
        });
    }

    function transformSubStateElement(
        _parentId: string,
        inStates: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, any>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, any>
    ): TransformedMenuItem {
        const { label, key, menuKey, itemClassName, newWindow, linkStyle, linkClassName, title } = state;

        const url = inStates.getUrlForSubState(state);
        const active = inStates.isSubStateActive(state);

        // const newId = idToDomId(`${parentId}.${menuKey}`);

        const anchorProps: AnchorProps = {
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
        const tabLabel = <Anchor {...anchorProps} />;

        const { navControl } = props;

        const { fallback } = stateSpace;

        const parentName = 'NavTabBarAnt:' + props.id + ':' + menuKey;

        const children = active
            ? renderSubStateCore({
                  state,
                  fallback,
                  navigationContext: props,
                  tokenIncrease: state ? state.totalPathTokens.length : 1,
                  checkCondition: false,
                  navControl: {
                      getParentName: () => parentName,
                      getAncestorNames: () => [...(navControl ? navControl.getAncestorNames() : []), parentName],
                      registerStateHooks: (hooks, componentId?) =>
                          states.registerNavStateHooksForSubState(state, hooks, componentId),
                      unregisterStateHooks: (componentId?) =>
                          states.unregisterNavStateHooksForSubState(state, componentId),
                      isActive: () => (!navControl || navControl.isActive()) && states.isSubStateActive(state),
                  },
              })
            : null;

        return {
            // tabKey: newId, // TODO: how do we get this into the DOM?
            key: menuKey,
            label: tabLabel,
            children,
        };
    }

    function transformErrorPanel(
        parentId: string,
        myFallback: UIFragmentSpec = 'Content not found',
        wantedPart: string | undefined
    ): TransformedMenuItem {
        const newId = idToDomId(`${parentId}.${NOT_FOUND}`);
        const children = renderUIFragment(extractUIFragmentFromSpec(undefined, myFallback, wantedPart));
        return {
            id: newId,
            key: NOT_FOUND,
            label: '???',
            children,
        };
    }

    const states = getLocationDependantStateSpaceHandler();
    const { extras = [], style, mode, id, stateSpace, part } = props;
    const activeKey = states.getActiveSubStateMenuKeys(true)[0];
    const subStatesToShow = states.getFilteredSubStates({
        onlyVisible: true,
        onlySatisfying: true,
    });
    const menuItems: TransformedMenuItem[] = subStatesToShow.map((state) =>
        transformSubStateElement(id, states, state)
    );
    if (!activeKey) {
        menuItems.push(transformErrorPanel(id, stateSpace.fallback, part));
    }

    const tabTarExtraContent = extras?.length ? (
        <>
            {' '}
            {extras.map((f, index) => (
                <span key={`extra-${index}`}> {renderUIFragment(f)} </span>
            ))}{' '}
        </>
    ) : null;

    return (
        <Tabs
            data-testid={id}
            tabPosition={mode || 'top'}
            activeKey={activeKey || NOT_FOUND}
            onTabClick={(menuKey: string) => {
                /**
                 * Normally we shouldn't get here, since the click is going to be captured
                 * by the Anchor widget. However, it's possible that the Anchor widget
                 * doesn't cover the whole area of the tab, and so it's still possible to
                 * click on the tab. For those cases, we add this fallback function here.
                 */
                // console.log('Clicked on tab "' + menuKey + '". This should not be happening.');
                states.trySelectSubState(states.findStateForMenuKey(menuKey));
            }}
            style={style}
            items={menuItems}
            tabBarExtraContent={tabTarExtraContent}
        />
    );
});
