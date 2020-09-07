import { v4 as uuidv4 } from 'uuid';
import {
    getNextPathToken,
    isTokenEmpty,
    NavigableContent,
    SubStateCoreInfo,
    TestLocation,
    UsesLocation,
    HookMap,
} from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import { renderSubStateCore } from './rendering';
import { UIFragmentSpec } from './UIFragmentSpec';

/**
 * This is the full spec of the root-or-details component
 */
interface OwnProps<DataType> {
    ifRoot: SubStateCoreInfo<UIFragmentSpec, DataType>;
    ifDetails: SubStateCoreInfo<UIFragmentSpec, DataType>;
}

type ComponentProps<DataType> = UsesLocation & NavigableContent<UIFragmentSpec, DataType>;

export interface DetailProps {
    token: string;
}

export function rootOrDetails<DataType>(ownProps: OwnProps<DataType>) {
    const nodeId = uuidv4();
    return inject('locationManager')(
        observer((props: ComponentProps<DataType>) => {
            const { navControl } = props;
            // console.log('root-or-details navControl is', navControl);
            const rootHooks = new HookMap();
            const detailHooks = new HookMap();
            const isRootActive = () => navControl.isActive() && isTokenEmpty(getNextPathToken(props));
            const isDetailActive = () => navControl.isActive() && !isRootActive();

            /**
             * We register ourselves as a change interceptor,
             * because we might have to hide some content
             * on location changes, and we want to know about that
             * in advance, so that we can suggest some questions to ask
             * from the user.
             */
            props.locationManager!.registerChangeInterceptor({
                getId() {
                    return nodeId;
                },

                /**
                 * This is our "change interceptor" hook, that will be called by the
                 * `LocationManager`.
                 */
                // tslint:disable-next-line:cyclomatic-complexity
                anyQuestionsFor(location: TestLocation): string[] {
                    const oldToken = getNextPathToken(props);
                    const oldRoot = isTokenEmpty(oldToken);

                    const newToken = location.pathTokens[props.parsedTokens!];
                    const newRoot = isTokenEmpty(newToken);

                    if (newRoot) {
                        if (oldRoot) {
                            // Staying at root, nothing to do.
                        } else {
                            // Going from detail to root.
                            // We would hide the detail, so check with it.
                            return detailHooks
                                .getAll()
                                .map(h => (h.getLeaveQuestion ? h.getLeaveQuestion() : undefined))
                                .filter(q => !!q) as string[];
                        }
                    } else {
                        if (oldRoot) {
                            // Going from root to detail.
                            // We would hide the root, so check with it.
                            return rootHooks
                                .getAll()
                                .map(h => (h.getLeaveQuestion ? h.getLeaveQuestion() : undefined))
                                .filter(q => !!q) as string[];
                        } else {
                            // Staying ad detail, nothing to do
                        }
                    }
                    return [];
                },
            });

            const { ifRoot, ifDetails } = ownProps;
            const token = getNextPathToken(props);
            if (isTokenEmpty(token)) {
                return renderSubStateCore({
                    state: ifRoot,
                    navigationContext: props,
                    checkCondition: true,
                    navControl: {
                        getParentName: () => 'rootOrDetail:root',
                        getAncestorNames: () => [...navControl.getAncestorNames(), 'rootOrDetail:root'],
                        isActive: isRootActive,
                        registerStateHooks: rootHooks.set,
                        unregisterStateHooks: rootHooks.reset,
                    },
                });
            } else {
                const detailProps: DetailProps = {
                    token,
                };
                return renderSubStateCore({
                    state: ifDetails,
                    navigationContext: props,
                    tokenIncrease: 1,
                    extraProps: detailProps,
                    checkCondition: true,
                    navControl: {
                        getParentName: () => 'rootOrDetail:detail',
                        getAncestorNames: () => [...navControl.getAncestorNames(), 'rootOrDetail:detail'],
                        isActive: isDetailActive,
                        registerStateHooks: detailHooks.set,
                        unregisterStateHooks: detailHooks.reset,
                    },
                });
            }
        })
    );
}
