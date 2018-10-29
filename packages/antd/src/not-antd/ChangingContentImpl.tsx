import * as React from 'react';

import {
    renderFragment,
    getFragmentPart,
    UIFragmentSpec,
    SubState,
    StateSpaceHandler,
    StateSpaceHandlerImpl,
} from '@moxb/moxb';
import { ChangingContentProps } from './ChangingContent';

export class ChangingContentImpl extends React.Component<ChangingContentProps> {
    protected readonly _states: StateSpaceHandler;

    public constructor(props: ChangingContentProps) {
        super(props);
        this._states = new StateSpaceHandlerImpl(props);
    }

    public debugLog(...messages: any[]) {
        if (this.props.debug) {
            (console as any).log(...messages);
        }
    }

    protected renderWantedChild(wantedChild: SubState | null, level: number) {
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
            parsedTokens: level + 1,
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
        const { tokens, parsedTokens, fallback, part, mountAll, debug } = this.props;
        this.debugLog('Looking up', part ? 'part ' + part : 'single fragment');
        const level = parsedTokens || 0;
        const token = tokens[level];
        if (debug) {
            console.log('tokens are', tokens);
            console.log('number of parsed tokens is', parsedTokens);
            console.log('level is', level);
            console.log('Choosing token:', token);
        }

        const wantedChild = this._states.findSubState(tokens, parsedTokens);

        this.debugLog('wantedChild is', wantedChild);

        if (mountAll) {
            return this.renderAllChildren(wantedChild);
        } else {
            if (wantedChild && wantedChild.subStates) {
                this.debugLog('it has subStates');
                return (
                    <ChangingContentImpl
                        tokens={tokens}
                        parsedTokens={level + 1}
                        subStates={wantedChild.subStates}
                        part={part}
                        fallback={fallback}
                        mountAll={false}
                    />
                );
            } else {
                this.debugLog('no subStates');
                return this.renderWantedChild(wantedChild, level);
            }
        }
    }
}
