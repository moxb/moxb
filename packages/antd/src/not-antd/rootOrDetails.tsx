import {
    getNextPathToken,
    isTokenEmpty,
    Navigable,
    SubStateCoreInfo,
    UsesLocation,
    NavStateHooks,
    TestLocation,
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

type ComponentProps<DataType> = UsesLocation & Navigable<UIFragmentSpec, DataType>;

export interface DetailProps {
    token: string;
}

export function rootOrDetails<DataType>(ownProps: OwnProps<DataType>) {
    return inject('locationManager')(
        observer((props: ComponentProps<DataType>) => {
            let rootHooks: NavStateHooks | undefined;
            const registerNavStateHooksForRoot = (hooks: NavStateHooks) => (rootHooks = hooks);

            let detailHooks: NavStateHooks | undefined;
            const registerNavStateHooksForDetail = (hooks: NavStateHooks) => (detailHooks = hooks);

            props.locationManager!.registerUser({
                tryLocation(location: TestLocation): string[] {
                    const oldToken = getNextPathToken(props);
                    const oldRoot = isTokenEmpty(oldToken);

                    const newToken = location.pathTokens[props.parsedTokens!];
                    const newRoot = isTokenEmpty(newToken);

                    if (newRoot) {
                        if (oldRoot) {
                            // Staying at root, nothing to do.
                        } else {
                            // Going from detail to root
                            if (detailHooks && detailHooks.getLeaveQuestion) {
                                const q = detailHooks.getLeaveQuestion();
                                return q ? [q] : [];
                            }
                        }
                    } else {
                        if (oldRoot) {
                            // Going from root to detail
                            if (rootHooks && rootHooks.getLeaveQuestion) {
                                const q = rootHooks.getLeaveQuestion();
                                return q ? [q] : [];
                            }
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
                        registerStateHooks: registerNavStateHooksForRoot,
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
                    },
                });
            }
        })
    );
}
