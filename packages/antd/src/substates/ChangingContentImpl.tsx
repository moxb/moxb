import * as React from 'react';

import { SubState, UIFragment, renderFragment, UIFragmentSpec, UIFragmentMap } from '@moxb/moxb';
import { ChangingContentProps } from './ChangingContent';

const findRoot = (substates: SubState[]) => substates.find(s => !!s.root);

const findSubstate = (substates: SubState[], token: string, separator: string) =>
    substates.find(s => !!s.path && s.path.split(separator)[0] === token);

const isMap = (spec: UIFragmentSpec) => {
    if (typeof spec !== 'object') {
        return false;
    }
    if ((spec as any).main) {
        return true;
    }
    return !(spec as any).props;
};

const getMap = (spec: UIFragmentSpec, debug?: boolean): UIFragmentMap => {
    const alreadyMap = isMap(spec);
    if (!!debug) {
        console.log('Is spec a map?', alreadyMap, typeof spec);
    }
    return alreadyMap ? (spec as UIFragmentMap) : { main: spec as UIFragment };
};

const getPart = (spec: UIFragmentSpec, part?: string, debug?: boolean) => {
    const map = getMap(spec, debug);
    const wanted = part || 'main';
    const result = (map as any)[wanted] || null;
    if (!!debug) {
        console.log('Map is', map);
        console.log('Wanted part is', part);
        console.log('Result is', result);
    }
    return result;
};

export class ChangingContentImpl extends React.Component<ChangingContentProps> {
    public isDebug() {
        return this.props.debug;
    }

    public render() {
        const { rawPath, substates, fallback, part, mountAll, separator, rootPath, debug } = this.props;
        const path = Array.isArray(rawPath) ? rawPath : [rawPath];
        const debugLog = (...stuff: any[]) => {
            if (debug) {
                (console as any).log(...stuff);
            }
        };
        debugLog('Looking up', part);
        const level = (rootPath || separator).split(separator).length - 2;
        const token = path[level];
        if (debug) {
            console.log('rootPath is', rootPath || separator);
            console.log('level is', level);
            console.log('Choosing token:', token);
        }

        const wantedChild = !token || token === '' ? findRoot(substates) : findSubstate(substates, token, separator);

        debugLog('wantedChild is', wantedChild);

        if (mountAll) {
            return (
                <div>
                    {substates.map(s => {
                        return renderFragment(getPart(s.fragment, part, debug), {
                            key: s.path,
                            invisible: s !== wantedChild,
                        });
                    })}
                </div>
            );
        } else {
            if (wantedChild && wantedChild.subStates) {
                debugLog('it has substates');
                return (
                    <ChangingContentImpl
                        rootPath={(rootPath || separator) + wantedChild.path}
                        separator={separator}
                        rawPath={path}
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
                const fragment = getPart(spec, part, debug);
                debugLog('Wanted part is', fragment);
                const result = renderFragment(fragment);
                return result;
            }
        }
    }
}
