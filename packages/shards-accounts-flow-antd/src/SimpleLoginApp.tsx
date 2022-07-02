import * as React from 'react';

import { WithLoginFlow, WithLoginFlowProps } from './WithLoginFlow';
import { OnlyUsers } from './OnlyUsers';

type SimpleLoginAppProps = WithLoginFlowProps;

/**
 * Wrap this component around your app to provide a login redirection workflow
 */
export const SimpleLoginApp = (props: SimpleLoginAppProps) => {
    const { children, ...rest } = props;
    return (
        <WithLoginFlow {...rest}>
            <OnlyUsers>{children}</OnlyUsers>
        </WithLoginFlow>
    );
};
