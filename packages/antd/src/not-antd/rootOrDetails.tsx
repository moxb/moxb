import { HookMap } from '@moxb/moxb';

const uuidv4 = require('uuid/v4');
import {
    getNextPathToken,
    isTokenEmpty,
    NavigableContent,
    NavStateHooks,
    SubStateCoreInfo,
    TestLocation,
    UsesLocation,
} from '@moxb/moxb';
import { inject, observer } from 'mobx-react';
import { renderSubStateCore } from './rendering';
import { UIFragmentSpec } from './UIFragmentSpec';

/**
 * This is the full spec of the root-or-details component
 */
interface OwnProps<DataType> {
    id: string;
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
            const rootHooks: HookMap = {};
            const registerNavStateHooksForRoot = (componentId: string, hooks: NavStateHooks) =>
                (rootHooks[componentId] = hooks);
            const unregisterNavStateHooksForRoot = (componentId: string) => delete rootHooks[componentId];
            const isRootActive = () => navControl.isActive() && isTokenEmpty(getNextPathToken(props));
            const wouldRootBeActive = (testLocation: TestLocation) =>
                navControl.wouldBeActive(testLocation) && isTokenEmpty(testLocation.pathTokens[props.parsedTokens!]);

            const detailHooks: HookMap = {};
            const registerNavStateHooksForDetail = (componentId: string, hooks: NavStateHooks) =>
                (detailHooks[componentId] = hooks);
            const unregisterNavStateHooksForDetail = (componentId: string) => delete detailHooks[componentId];
            const isDetailActive = () => navControl.isActive() && !isRootActive();
            const wouldDetailBeActive = (testLocation: TestLocation) =>
                navControl.wouldBeActive(testLocation) && !isTokenEmpty(testLocation.pathTokens[props.parsedTokens!]);

            /**
             * Compute which sub-states would be enabled when we changed from this older location
             */
            const getEnteredHooksFrom = (oldLocation: TestLocation): NavStateHooks[] => {
                const oldRoot = wouldRootBeActive(oldLocation);
                const oldDetail = wouldDetailBeActive(oldLocation);
                const newRoot = isRootActive();
                const newDetail = isDetailActive();

                return [
                    ...(!oldRoot && newRoot ? Object.values(rootHooks).filter(h => !!h) : []),
                    ...(!oldDetail && newDetail ? Object.values(detailHooks).filter(h => !!h) : []),
                ];
            };

            /**
             * Compute which sub-states would be disabled if we changed to this new location
             */
            const getLeavingHooksTo = (newLocation: TestLocation): NavStateHooks[] => {
                const oldActive = navControl.isActive();
                const oldRoot = isRootActive();
                const oldDetail = isDetailActive();
                const newActive = navControl.wouldBeActive(newLocation);
                const newRoot = wouldRootBeActive(newLocation);
                const newDetail = wouldDetailBeActive(newLocation);
                console.log(
                    'Testing',
                    newLocation,
                    'for',
                    ownProps.id,
                    'active:',
                    oldActive,
                    '==>',
                    newActive,
                    'root:',
                    oldRoot,
                    '==>',
                    newRoot,
                    'detail:',
                    oldDetail,
                    '==>',
                    newDetail,
                    navControl
                );
                return [
                    ...(oldRoot && !newRoot ? Object.values(rootHooks).filter(h => !!h) : []),
                    ...(oldDetail && !newDetail ? Object.values(detailHooks).filter(h => !!h) : []),
                ];
            };

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
                anyQuestionsFor(testLocation: TestLocation): string[] {
                    return getLeavingHooksTo(testLocation)
                        .map(h => h.getLeaveQuestion)
                        .filter(gen => !!gen)
                        .map(gen => gen!())
                        .filter(q => !!q) as string[];
                },

                onBeforeChange(newLocation: TestLocation) {
                    getLeavingHooksTo(newLocation)
                        .map(h => h.onLeave)
                        .filter(cb => !!cb)
                        .forEach(cb => cb!());
                },

                onAfterChange(oldLocation: TestLocation) {
                    getEnteredHooksFrom(oldLocation)
                        .map(h => h.onEnter)
                        .filter(cb => !!cb)
                        .forEach(cb => cb!());
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
                        registerStateHooks: registerNavStateHooksForRoot,
                        unregisterStateHooks: unregisterNavStateHooksForRoot,
                        isActive: isRootActive,
                        wouldBeActive: wouldRootBeActive,
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
                        registerStateHooks: registerNavStateHooksForDetail,
                        unregisterStateHooks: unregisterNavStateHooksForDetail,
                        isActive: isDetailActive,
                        wouldBeActive: wouldDetailBeActive,
                    },
                });
            }
        })
    );
}
