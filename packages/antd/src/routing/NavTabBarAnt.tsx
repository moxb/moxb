import {
    idToDomId,
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    SubStateInContext,
} from '@moxb/moxb';
import { Tabs } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { renderUIFragment, UIFragment, UIFragmentSpec } from '@moxb/html';
import * as Anchor from '@moxb/html/dist/Anchor';
import { renderSubStateCore } from '@moxb/html/dist/rendering';

const TabPane = Tabs.TabPane;

const NOT_FOUND = '_not_found_404';

export interface NavTabProps<DataType>
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
     * Tab bar alignment mode
     */
    mode?: 'top' | 'right' | 'bottom' | 'left';

    /**
     * Show this when an undefined tab is requested
     */
    fallback?: UIFragment;
}

@inject('locationManager')
@observer
/**
 * This widget show an Ant tab bar, based on the state-space.
 */
export class NavTabBarAnt<DataType> extends React.Component<NavTabProps<DataType>> {
    protected getLocationDependantStateSpaceHandler() {
        const { id, children: _children, extras, style, mode, ...stateProps } = this.props;

        return new LocationDependentStateSpaceHandlerImpl({
            ...stateProps,
            id: 'tab bar of ' + (this.props.id || 'no-id'),
            intercept: true,
        });
    }

    // tslint:disable-next-line:cyclomatic-complexity
    protected renderStateTabPane(
        parentId: string,
        states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>
    ) {
        const { navControl } = this.props;
        const { label, key, menuKey, itemClassName, newWindow, linkStyle, linkClassName, title } = state;

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
        const tabLabel = <Anchor.Anchor {...anchorProps} />;
        const id = idToDomId(`${parentId}.${menuKey}`);
        const parentName = 'NavTabBarAnt:' + this.props.id + ':' + menuKey;
        return (
            <TabPane data-testid={id} key={menuKey} tab={tabLabel} {...itemProps}>
                {states.isSubStateActive(state) &&
                    renderSubStateCore({
                        state: state,
                        navigationContext: this.props,
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

    protected renderErrorPanel(parentId: string, content: UIFragment = 'Content not found') {
        const id = idToDomId(`${parentId}.${NOT_FOUND}`);
        return (
            <TabPane data-testid={id} key={NOT_FOUND} tab={'???'}>
                {renderUIFragment(content)}
            </TabPane>
        );
    }

    public render() {
        const states = this.getLocationDependantStateSpaceHandler();
        const { extras = [], style, mode, id, fallback } = this.props;
        const activeKey = states.getActiveSubStateMenuKeys(true)[0];
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
            >
                {states
                    .getFilteredSubStates({
                        onlyVisible: true,
                        onlySatisfying: true,
                    })
                    .map((state) => this.renderStateTabPane(id, states, state))}
                {extras.map((f) => renderUIFragment(f))}
                {!activeKey && this.renderErrorPanel(id, fallback)}
            </Tabs>
        );
    }
}
