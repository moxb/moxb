import {
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    SubStateInContext,
} from '@moxb/moxb';
import { Tabs } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { UIFragment, UIFragmentSpec } from '../not-antd';
import { renderSubStateCore } from '../not-antd/rendering';

const TabPane = Tabs.TabPane;

export interface NavTabProps<DataType>
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
     * Tab bar alignment mode
     */
    mode?: 'top' | 'right' | 'bottom' | 'left';
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
        });
    }

    // tslint:disable-next-line:cyclomatic-complexity
    protected renderStateTabPane(
        states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>,
        state: SubStateInContext<UIFragment, UIFragmentSpec, DataType>
    ) {
        const { label, key, itemClassName } = state;
        const itemProps: any = {};
        if (itemClassName) {
            itemProps.className = itemClassName;
        }
        return (
            <TabPane key={key} tab={label || key} {...itemProps}>
                {renderSubStateCore({
                    state: state,
                    navigationContext: this.props,
                    tokenIncrease: state ? state.totalPathTokens.length : 1,
                    checkCondition: false,
                    navControl: {
                        registerStateHooks: hooks => states.registerNavStateHooksForSubState(state, hooks),
                    },
                })}
            </TabPane>
        );
    }

    public render() {
        const states = this.getLocationDependantStateSpaceHandler();
        const { extras, style, mode } = this.props;
        return (
            <Tabs
                tabPosition={mode || 'top'}
                activeKey={states.getActiveSubState() !== null ? states.getActiveSubState()!.key : undefined}
                onChange={(key: string) => {
                    const allStates = states.getFilteredSubStates({});
                    const currentState = allStates.find(state => state.key === key);
                    if (currentState) {
                        states.doSelectSubState(currentState);
                    }
                }}
                style={style}
            >
                {states
                    .getFilteredSubStates({
                        onlyVisible: true,
                        onlySatisfying: true,
                    })
                    .map(state => this.renderStateTabPane(states, state))}
                {...extras || []}
            </Tabs>
        );
    }
}
