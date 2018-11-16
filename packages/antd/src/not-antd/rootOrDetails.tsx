import { inject, observer } from 'mobx-react';
import { Navigable, UsesLocation, getNextPathToken, isTokenEmpty } from '@moxb/moxb';
import { renderUIFragment, UIFragment } from './UIFragment';

interface OwnProps<DataType> {
    root: UIFragment;
    rootData?: DataType;
    details: UIFragment;
    detailsData?: DataType;
}

type ComponentProps = UsesLocation & Navigable;

export interface DetailProps extends Navigable {
    token: string;
}

export function rootOrDetails<DataType>(ownProps: OwnProps<DataType>) {
    return inject('locationManager')(
        observer((props: ComponentProps) => {
            const { root, rootData, details, detailsData } = ownProps;
            const { parsedTokens } = props;
            const token = getNextPathToken(props);
            if (isTokenEmpty(token)) {
                if (rootData) {
                    // TODO: implement filtering
                    console.log('Should do something about', rootData);
                }
                return renderUIFragment(root);
            } else {
                if (detailsData) {
                    // TODO: implement filtering
                    console.log('Should do something about', detailsData);
                }
                const detailProps: DetailProps = {
                    token,
                    parsedTokens: (parsedTokens || 0) + 1,
                };
                return renderUIFragment(details, detailProps);
            }
        })
    );
}
