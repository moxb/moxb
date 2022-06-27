import { idToDomId } from '@moxb/moxb';
import {
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    SubStateInContext,
} from '@moxb/stellar-router-core';
import { Tabs } from 'antd';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {
    extractUIFragmentFromSpec,
    renderUIFragment,
    Anchor,
    AnchorProps,
    UIFragment,
    UIFragmentSpec,
} from '@moxb/react-html';
import { renderSubStateCore, useLocationManager, useOptionalTokenManager } from '@moxb/stellar-router-react';

const TabPane = Tabs.TabPane;

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
    const tokenManager = useOptionalTokenManager();

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

    // eslint-disable-next-line complexity
    function renderStateTabPane(
        parentId: string,
        states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, unknown>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, unknown>
    ) {
        const { navControl } = props;
        const { fallback } = stateSpace;
        const { label, key, menuKey, itemClassName, newWindow, linkStyle, linkClassName, title } = state;

        const url = states.getUrlForSubState(state);
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
        const newId = idToDomId(`${parentId}.${menuKey}`);
        const parentName = 'NavTabBarAnt:' + props.id + ':' + menuKey;
        return (
            <TabPane data-testid={newId} key={menuKey} tab={tabLabel} {...itemProps}>
                {states.isSubStateActive(state) &&
                    renderSubStateCore({
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
                    })}
            </TabPane>
        );
    }

    function renderErrorPanel(
        parentId: string,
        myFallback: UIFragmentSpec = 'Content not found',
        wantedPart: string | undefined
    ) {
        const newId = idToDomId(`${parentId}.${NOT_FOUND}`);
        return (
            <TabPane data-testid={newId} key={NOT_FOUND} tab={'???'}>
                {renderUIFragment(extractUIFragmentFromSpec(undefined, myFallback, wantedPart))}
            </TabPane>
        );
    }

    const stateSpaceHandler = getLocationDependantStateSpaceHandler();
    const { extras = [], style, mode, id, stateSpace, part } = props;
    const activeKey = stateSpaceHandler.getActiveSubStateMenuKeys(true)[0];
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
                stateSpaceHandler.trySelectSubState(stateSpaceHandler.findStateForMenuKey(menuKey));
            }}
            style={style}
        >
            {stateSpaceHandler
                .getFilteredSubStates({
                    onlyVisible: true,
                    onlySatisfying: true,
                })
                .map((state) => renderStateTabPane(id, stateSpaceHandler, state))}
            {extras.map((f) => renderUIFragment(f))}
            {!activeKey && renderErrorPanel(id, stateSpace.fallback, part)}
        </Tabs>
    );
});
