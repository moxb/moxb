import * as React from 'react';
import { inject, observer } from 'mobx-react';

import {
    renderUIFragment,
    StateSpaceAndLocationHandler,
    StateSpaceAndLocationHandlerImpl,
    getUIFragment,
    SubStateInContext,
} from '@moxb/moxb';
import { LocationDependentContentProps } from './LocationDependentContent';

@inject('locationManager')
@observer
export class LocationDependentContentImpl extends React.Component<LocationDependentContentProps> {
    protected readonly _states: StateSpaceAndLocationHandler;

    public constructor(props: LocationDependentContentProps) {
        super(props);

        const { id, part, fallback, mountAll, ...remnantProps } = props;
        this._states = new StateSpaceAndLocationHandlerImpl({
            ...remnantProps,
            id: 'changing content of' + id,
        });
    }

    public debugLog(...messages: any[]) {
        if (this.props.debug) {
            (console as any).log(...messages);
        }
    }

    protected renderChild(child: SubStateInContext | null, invisible?: boolean) {
        const { parsedTokens, fallback, part } = this.props;
        const newParsedTokens = (parsedTokens || 0) + (child ? child.totalPathTokens.length : 1);
        const fragment = getUIFragment(child ? child.fragment : null, fallback, part, false); // debug);
        this.debugLog('Rendering fragment', fragment);
        const props: any = {
            parsedTokens: newParsedTokens,
            key: child ? child.key : 'missing',
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
            return <div>{this._states._subStatesInContext.map(s => this.renderChild(s, s !== wantedChild))}</div>;
        } else {
            return this.renderChild(wantedChild);
        }
    }
}
