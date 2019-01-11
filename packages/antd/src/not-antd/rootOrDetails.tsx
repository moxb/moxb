import { getNextPathToken, isTokenEmpty, Navigable, SubStateCoreInfo, UsesLocation } from '@moxb/moxb';
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

interface ComponentProps<DataType> extends UsesLocation, Navigable<UIFragmentSpec, DataType> {}

export interface DetailProps {
    token: string;
}

export function rootOrDetails<DataType>(ownProps: OwnProps<DataType>) {
    return inject('locationManager')(
        observer((props: ComponentProps<DataType>) => {
            const { ifRoot, ifDetails } = ownProps;
            const token = getNextPathToken(props);
            if (isTokenEmpty(token)) {
                return renderSubStateCore({
                    state: ifRoot,
                    navigationContext: props,
                    checkCondition: true,
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
                });
            }
        })
    );
}
