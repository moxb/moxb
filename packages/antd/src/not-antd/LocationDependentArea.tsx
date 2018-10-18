import * as React from 'react';
import { inject, observer } from 'mobx-react';

import {
    renderUIFragment,
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerImpl,
    UIFragmentSpec,
    extractUIFragmentFromSpec,
    SubStateInContext,
    LocationDependentStateSpaceHandlerProps,
} from '@moxb/moxb';

export interface LocationDependentAreaProps extends LocationDependentStateSpaceHandlerProps {
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

@inject('locationManager')
@observer
export class LocationDependentArea extends React.Component<LocationDependentAreaProps> {
    protected readonly _states: LocationDependentStateSpaceHandler;

    public constructor(props: LocationDependentAreaProps) {
        super(props);

        const { id, part, fallback, mountAll, ...remnantProps } = props;
        this._states = new LocationDependentStateSpaceHandlerImpl({
            ...remnantProps,
            id: 'changing content of' + id,
        });
    }

    public debugLog(...messages: any[]) {
        if (this.props.debug) {
            (console as any).log(...messages);
        }
    }

    protected renderSubState(subState: SubStateInContext | null, invisible?: boolean) {
        const { parsedTokens, fallback, part } = this.props;
        const newParsedTokens = (parsedTokens || 0) + (subState ? subState.totalPathTokens.length : 1);
        const fragment = extractUIFragmentFromSpec((subState || ({} as any)).fragment, fallback, part);
        this.debugLog('Rendering fragment', fragment);
        const props: any = {
            parsedTokens: newParsedTokens,
            key: subState ? subState.key : 'missing',
        };
        if (invisible) {
            props.invisible = true;
        }
        return renderUIFragment(fragment, props);
    }

    public render() {
        const { mountAll } = this.props;
        const wantedChild = this._states.getActiveSubState();
        this.debugLog('wantedChild is', wantedChild);
        if (mountAll) {
            this.debugLog('Rendering all children at once');
            return <div>{this._states._subStatesInContext.map(s => this.renderSubState(s, s !== wantedChild))}</div>;
        } else {
            return this.renderSubState(wantedChild);
        }
    }
}
