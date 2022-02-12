import {
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    NavigableContent,
    StateSpace,
    SubStateInContext,
} from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { renderSubStateCore } from './rendering';
import { UIFragment } from './UIFragment';
import { UIFragmentSpec } from './UIFragmentSpec';

export type UIStateSpace<DataType = {}> = StateSpace<UIFragment, UIFragmentSpec, DataType>;
export type NavigableUIContent = NavigableContent<UIFragment, UIFragmentSpec>;

export interface LocationDependentAreaProps<DataType>
    extends LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType> {
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
     * What to show when a given sub-state doesn't specify any content
     */
    fallback?: UIFragmentSpec;

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

@inject('locationManager', 'tokenManager')
@observer
export class LocationDependentArea<DataType> extends React.Component<LocationDependentAreaProps<DataType>> {
    public constructor(props: LocationDependentAreaProps<DataType>) {
        super(props);
    }

    componentDidMount() {
        if (this.props.useTokenMappings) {
            const states = this._getStates(this.props);
            states.registerTokenMappings();
        }
    }

    componentWillUnmount() {
        if (this.props.useTokenMappings) {
            const states = this._getStates(this.props);
            states.unregisterTokenMappings();
        }
    }

    componentDidUpdate(prevProps: Readonly<LocationDependentAreaProps<DataType>>) {
        if (this.props.useTokenMappings) {
            const prevStates = this._getStates(prevProps);
            prevStates.unregisterTokenMappings();
            const newStates = this._getStates(this.props);
            newStates.registerTokenMappings();
        }
    }

    debugLog(...messages: any[]) {
        if (this.props.debug) {
            (console as any).log(`LDA "${this.props.id}":`, ...messages);
        }
    }

    renderSubState(
        states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>,
        subState: SubStateInContext<UIFragment, UIFragmentSpec, DataType> | null,
        invisible?: boolean
    ) {
        const { navControl, id } = this.props;
        const extraProps: any = {
            key: subState ? subState.key : 'missing',
        };
        if (invisible) {
            extraProps.invisible = true;
        }
        const parentName = 'LocationDependentArea:' + id + ':' + (subState ? subState.menuKey : 'null');
        return renderSubStateCore({
            state: subState,
            navigationContext: this.props,
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

    private _getStates(props: LocationDependentAreaProps<DataType>) {
        const {
            id,
            part,
            fallback,
            mountAll,
            // useTokenMappings,
            ...remnantProps
        } = props;
        const states: LocationDependentStateSpaceHandler<
            UIFragment,
            UIFragmentSpec,
            DataType
        > = new LocationDependentStateSpaceHandlerImpl({
            ...remnantProps,
            id: 'changing content of ' + id,
            intercept: true,
        });
        return states;
    }

    render() {
        this.debugLog(` *** Rendering with state space "${this.props.stateSpace.metaData}"`);

        const {
            // id,
            // part,
            // fallback,
            mountAll,
            // useTokenMappings,
            // ...remnantProps
        } = this.props;

        const states = this._getStates(this.props);

        const wantedChild = states.getActiveSubState();
        this.debugLog('wantedChild is', wantedChild);
        if (mountAll && wantedChild) {
            this.debugLog('Rendering all children at once');
            return states
                .getFilteredSubStates({
                    onlyVisible: false,
                    onlyLeaves: true,
                    onlySatisfying: true,
                    noDisplayOnly: true,
                })
                .map((s, i) => (
                    <div key={`${i}`} style={s !== wantedChild ? { display: 'none' } : s.containerStyle}>
                        {this.renderSubState(states, s, s !== wantedChild)}
                    </div>
                ));
        } else {
            return this.renderSubState(states, wantedChild);
        }
    }
}
