import * as React from 'react';

import { renderFragment, getFragmentPart, UIFragmentSpec, StateSpaceHandler, StateSpaceHandlerImpl } from '@moxb/moxb';
import { ChangingContentProps } from './ChangingContent';

export class ChangingContentImpl extends React.Component<ChangingContentProps> {
    protected readonly _states: StateSpaceHandler;

    public constructor(props: ChangingContentProps) {
        super(props);
        this._states = new StateSpaceHandlerImpl(props);
    }

    public render() {
        const { tokens, parsedTokens, substates, fallback, part, mountAll, debug } = this.props;
        const debugLog = (...stuff: any[]) => {
            if (debug) {
                (console as any).log(...stuff);
            }
        };
        debugLog('Looking up', part ? 'part ' + part : 'single fragment');
        const level = parsedTokens || 0;
        const token = tokens[level];
        if (debug) {
            console.log('tokens are', tokens);
            console.log('number of parsed tokens is', parsedTokens);
            console.log('level is', level);
            console.log('Choosing token:', token);
        }

        const wantedChild = this._states.findSubState(tokens, parsedTokens);

        debugLog('wantedChild is', wantedChild);

        if (mountAll) {
            // TODO: I think this codepath doesn't properly consider
            // the fallback values with multiple parts
            return (
                <div>
                    {substates.map(s =>
                        renderFragment(getFragmentPart(s.fragment, part, debug), {
                            key: s.key,
                            invisible: s !== wantedChild,
                        })
                    )}
                </div>
            );
        } else {
            if (wantedChild && wantedChild.subStates) {
                debugLog('it has substates');
                return (
                    <ChangingContentImpl
                        tokens={tokens}
                        parsedTokens={level + 1}
                        substates={wantedChild.subStates}
                        part={part}
                        fallback={fallback}
                        mountAll={false}
                    />
                );
            } else {
                debugLog('no substates');
                debugLog('fallback is', fallback);
                let spec: UIFragmentSpec;
                if (part) {
                    debugLog('Looking for a specific part, creating object for parts...');
                    spec = {
                        ...(fallback as any),
                        ...(wantedChild ? (wantedChild.fragment as any) : {}),
                    };
                } else {
                    debugLog('Not looking for a specific part, just using whole fragment');
                    spec = wantedChild ? wantedChild.fragment : fallback;
                }
                debugLog('spec is', spec);
                const fragment = getFragmentPart(spec, part, debug);
                debugLog('Wanted part is', fragment);
                return renderFragment(fragment, {
                    parsedTokens: level + 1,
                });
            }
        }
    }
}
