import { inject, observer } from 'mobx-react';
import { Navigable, UsesLocation, SubStateCoreInfo, getNextPathToken, isTokenEmpty } from '@moxb/moxb';
import { UIFragmentSpec } from './UIFragmentSpec';
import { renderSubStateCore } from './rendering';

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
