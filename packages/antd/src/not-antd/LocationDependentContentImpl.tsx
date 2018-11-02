import * as React from 'react';
import { inject, observer } from 'mobx-react';

import {
    renderFragment,
    getFragmentPart,
    UIFragmentSpec,
    SubState,
    StateSpaceAndLocationHandler,
    StateSpaceAndLocationHandlerImpl,
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

    protected renderWantedChild(wantedChild: SubState | null, parsedTokens: number) {
        const { part, fallback, debug } = this.props;
        this.debugLog('fallback is', fallback);
        let spec: UIFragmentSpec;
        if (part) {
            this.debugLog('Looking for a specific part, creating object for parts...');
            spec = {
                ...(fallback as any),
                ...(wantedChild ? (wantedChild.fragment as any) : {}),
            };
        } else {
            this.debugLog('Not looking for a specific part, just using whole fragment');
            spec = wantedChild ? wantedChild.fragment : fallback;
        }
        this.debugLog('spec is', spec);
        const fragment = getFragmentPart(spec, part, debug);
        this.debugLog('Wanted part is', fragment);
        return renderFragment(fragment, {
            parsedTokens,
        });
    }

    protected renderAllChildren(wantedChild: SubState | null) {
        const { subStates, part, debug } = this.props;
        // TODO: I think this codepath doesn't properly consider
        // the fallback values with multiple parts
        return (
            <div>
                {subStates.map(s =>
                    renderFragment(getFragmentPart(s.fragment, part, debug), {
                        key: s.key,
                        invisible: s !== wantedChild,
                    })
                )}
            </div>
        );
    }

    public render() {
        const { parsedTokens, mountAll } = this.props;
        const activeStates = this._states.getActiveSubStates(true);
        if (activeStates.length > 1) {
            throw new Error('Uh-oh. More than one active state found');
        }
        const wantedChild = activeStates[0];
        this.debugLog('wantedChild is', wantedChild);
        if (mountAll) {
            return this.renderAllChildren(wantedChild);
        } else {
            const level = (parsedTokens || 0) + (wantedChild ? wantedChild.totalPathTokens.length : 1);
            return this.renderWantedChild(wantedChild, level);
        }
    }
}
