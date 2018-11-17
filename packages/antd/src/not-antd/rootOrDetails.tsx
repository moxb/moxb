import { inject, observer } from 'mobx-react';
import { Navigable, UsesLocation, getNextPathToken, isTokenEmpty } from '@moxb/moxb';
import { renderUIFragment } from './UIFragment';
import { extractUIFragmentFromSpec, UIFragmentSpec } from './UIFragmentSpec';

/**
 * This is how we specify the individual parts (root and detail)
 */
interface PartData<DataType> {
    data?: DataType;
    fragment: UIFragmentSpec;
}

/**
 * This is the full spec of the root-or-details component
 */
interface OwnProps<DataType> {
    ifRoot: PartData<DataType>;
    ifDetails: PartData<DataType>;
}

type ComponentProps<DataType> = UsesLocation & Navigable<UIFragmentSpec, DataType>;

export interface DetailProps<DataType> extends Navigable<UIFragmentSpec, DataType> {
    token: string;
}

export function rootOrDetails<DataType>(ownProps: OwnProps<DataType>) {
    return inject('locationManager')(
        observer((props: ComponentProps<DataType>) => {
            const { parsedTokens, filterCondition, fallback, part } = props;

            function renderPart(choice: PartData<DataType>, tokenIncrease = 0, otherProps: any = {}) {
                const navigableChildParams: Navigable<UIFragmentSpec, DataType> = {
                    parsedTokens: (parsedTokens || 0) + tokenIncrease,
                    filterCondition,
                    fallback,
                    part,
                };
                if (choice.data && filterCondition) {
                    if (!filterCondition(choice.data)) {
                        const fallbackFragment = extractUIFragmentFromSpec({}, fallback, part);
                        return renderUIFragment(fallbackFragment, navigableChildParams);
                    }
                }
                const childProps: DetailProps<DataType> = {
                    ...otherProps,
                    ...navigableChildParams,
                };
                const fragment = extractUIFragmentFromSpec(choice.fragment, fallback, part);
                return renderUIFragment(fragment, childProps);
            }

            const { ifRoot, ifDetails } = ownProps;
            const token = getNextPathToken(props);
            if (isTokenEmpty(token)) {
                return renderPart(ifRoot);
            } else {
                return renderPart(ifDetails, 1, { token });
            }
        })
    );
}
