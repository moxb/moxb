import {
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    LocationDependentStateSpaceHandlerProps,
    SubStateInContext,
} from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { renderSubStateCore } from './rendering';
import { UIFragment } from './UIFragment';
import { UIFragmentSpec } from './UIFragmentSpec';

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
    protected readonly _states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>;

    public constructor(props: LocationDependentAreaProps<DataType>) {
        super(props);

        const { id, part, fallback, mountAll, useTokenMappings, ...remnantProps } = props;
        this._states = new LocationDependentStateSpaceHandlerImpl({
            ...remnantProps,
            id: 'changing content of ' + id,
            intercept: true,
        });
    }

    public componentDidMount() {
        if (this.props.useTokenMappings) {
            this._states.registerTokenMappings();
        }
    }

    public componentWillUnmount() {
        if (this.props.useTokenMappings) {
            this._states.unregisterTokenMappings();
        }
    }

    public debugLog(...messages: any[]) {
        if (this.props.debug) {
            (console as any).log(...messages);
        }
    }

    protected renderSubState(
        subState: SubStateInContext<UIFragment, UIFragmentSpec, DataType> | null,
        invisible?: boolean
    ) {
        const extraProps: any = {
            key: subState ? subState.key : 'missing',
        };
        if (invisible) {
            extraProps.invisible = true;
        }
        return renderSubStateCore({
            state: subState,
            navigationContext: this.props,
            tokenIncrease: subState ? subState.totalPathTokens.length : 1,
            checkCondition: false, // We don't ever get to select this sub-state if the condition fails
            extraProps,
            navControl: {
                registerStateHooks: hooks => this._states.registerNavStateHooksForSubState(subState, hooks),
            },
        });
    }

    public render() {
        const { mountAll } = this.props;
        const wantedChild = this._states.getActiveSubState();
        this.debugLog('wantedChild is', wantedChild);
        if (mountAll) {
            this.debugLog('Rendering all children at once');
            return this._states._subStatesInContext.map((s, i) => (
                <div key={`${i}`} style={{ display: s !== wantedChild ? 'none' : undefined }}>
                    {this.renderSubState(s, s !== wantedChild)}
                </div>
            ));
        } else {
            return this.renderSubState(wantedChild);
        }
    }
}
