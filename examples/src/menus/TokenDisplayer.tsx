import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { UIFragmentSpec } from '@moxb/react-html';

import { getNextPathToken, getParsedPathTokens, Navigable } from '@moxb/stellar-router-core';
import { useLocationManager } from '@moxb/stellar-router-react';

export const TokenDisplayer = observer((props: Navigable<UIFragmentSpec>) => {
    const locationManager = useLocationManager('token displayer');
    return (
        <div>
            <div>
                We are at <b>{getParsedPathTokens({ ...props, locationManager }).join(' / ')}</b>
            </div>
            <div>
                Next token this <b>{getNextPathToken({ ...props, locationManager })}</b>
            </div>
        </div>
    );
});
