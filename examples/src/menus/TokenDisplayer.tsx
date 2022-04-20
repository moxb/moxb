import { UIFragmentSpec } from '@moxb/antd';
import { getNextPathToken, getParsedPathTokens, Navigable, useLocationManager } from '@moxb/moxb';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

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
