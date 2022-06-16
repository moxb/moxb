import { LocationDependentStateSpaceHandler, LocationDependentStateSpaceHandlerProps, SubStateInContext } from '@moxb/moxb';
import * as React from 'react';
import { UIFragment } from './UIFragment';
import { UIFragmentSpec } from './UIFragmentSpec';
export interface LocationDependentAreaProps<DataType> extends LocationDependentStateSpaceHandlerProps<UIFragment, UIFragmentSpec, DataType> {
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
export declare class LocationDependentArea<DataType> extends React.Component<LocationDependentAreaProps<DataType>> {
    protected readonly _states: LocationDependentStateSpaceHandler<UIFragment, UIFragmentSpec, DataType>;
    constructor(props: LocationDependentAreaProps<DataType>);
    componentDidMount(): void;
    componentWillUnmount(): void;
    debugLog(...messages: any[]): void;
    protected renderSubState(subState: SubStateInContext<UIFragment, UIFragmentSpec, DataType> | null, invisible?: boolean): JSX.Element | null;
    render(): JSX.Element | JSX.Element[] | null;
}
