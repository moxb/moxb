import * as React from 'react';
import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { UIFragment, UIFragmentSpec } from '@moxb/react-html';

import {
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    NavigableContent,
    StateSpace,
    SubStateInContext,
} from '@moxb/stellar-router-core';

import { renderSubStateCore } from './rendering';
import { useLocationManager, useOptionalTokenManager } from './routingProviders';

export type UIStateSpace<DataType = void> = StateSpace<UIFragment, UIFragmentSpec, DataType>;
export type NavigableUIContent = NavigableContent<UIFragmentSpec>;

export interface LocationDependentAreaProps<DataType>
    extends Omit<
        LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType>,
        'locationManager' | 'tokenManager'
    > {
    /**
     * When multiple parts of the layout needs to change
     * based on the same value, we can describe all of those
     * in a shared state space, as a map.
     * Here you can specify which part to pick.
     * If there is only one element of the layout that changes,
     * you can skip this/
     * */
    part?: string;

    /**
     * Should we use the token mappings defined for the sub-states?
     */
    useTokenMappings?: boolean;

    /**
     * Should we mount (but hide) the content of all possible selections of the state space?
     *
     * This will pass an invisible = true parameter to all children. The children react to that.
     *
     * Defaults to false.
     */
    mountAll?: boolean;

    /**
     * Enable debug output
     */
    debug?: boolean;
}

export const LocationDependentArea = observer((props: LocationDependentAreaProps<any>): JSX.Element | null => {
    const locationManager = useLocationManager('location dependent area for ' + props.id);
    const tokenManager = useOptionalTokenManager();

    const { id, part, useTokenMappings, ...rest } = props;
    const { debug, navControl, mountAll, stateSpace } = rest;
    const states: LocationDependentStateSpaceHandler<
        UIFragment,
        UIFragmentSpec,
        any
    > = new LocationDependentStateSpaceHandlerImpl({
        ...rest,
        id: 'changing content of ' + id,
        locationManager,
        tokenManager: useTokenMappings ? tokenManager : undefined,
        intercept: true,
    });

    function debugLog(...messages: any[]) {
        if (debug) {
            (console as any).log(`LDA "${props.id}":`, ...messages);
        }
    }

    useEffect(() => {
        if (useTokenMappings) {
            states.registerTokenMappings();
        }
        return () => {
            if (useTokenMappings) {
                states.unregisterTokenMappings();
            }
        };
    });

    function renderSubState(
        subState: SubStateInContext<UIFragment, UIFragmentSpec, any> | null,
        invisible?: boolean
    ): JSX.Element | null {
        const extraProps: any = {
            key: subState ? subState.key : 'missing',
        };
        if (invisible) {
            extraProps.invisible = true;
        }
        const parentName = 'LocationDependentArea:' + id + ':' + (subState ? subState.menuKey : 'null');
        return renderSubStateCore({
            state: subState,
            fallback,
            navigationContext: props,
            tokenIncrease: subState ? subState.totalPathTokens.length : 1,
            checkCondition: false, // We don't ever get to select this sub-state if the condition fails
            extraProps,
            navControl: {
                getParentName: () => parentName,
                getAncestorNames: () => [...(navControl ? navControl.getAncestorNames() : []), parentName],
                isActive: () =>
                    (!navControl || navControl.isActive()) && // Is the whole area active?
                    !!subState && // The fallback is never really considered to be active
                    states.isSubStateActive(subState), // Is the current sub-state active?
                registerStateHooks: (hooks, componentId?) =>
                    states.registerNavStateHooksForSubState(subState!, hooks, componentId),
                unregisterStateHooks: (componentId?) =>
                    states.unregisterNavStateHooksForSubState(subState!, componentId),
            },
        });
    }

    debugLog(` *** Rendering with state space "${props.stateSpace.metaData}"`);

    const { fallback } = stateSpace;

    const wantedChild = states.getActiveSubState();
    debugLog('wantedChild is', wantedChild);
    if (mountAll && wantedChild) {
        debugLog('Rendering all children at once');
        return (
            <>
                {states
                    .getFilteredSubStates({
                        onlyVisible: false,
                        onlyLeaves: true,
                        onlySatisfying: true,
                        noDisplayOnly: true,
                    })
                    .map((s, i) => (
                        <div key={`${i}`} style={s !== wantedChild ? { display: 'none' } : s.containerStyle}>
                            {renderSubState(s, s !== wantedChild)}
                        </div>
                    ))}
            </>
        );
    } else {
        return renderSubState(wantedChild);
    }
});
