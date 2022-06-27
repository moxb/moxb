import * as React from 'react';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { getParsedPathTokens } from '@moxb/stellar-router-core';
import { NavigableUIContent, useLocationManager } from '@moxb/stellar-router-react';

import { useStore } from '../store/Store';

export const DetailDisplay = observer((props: NavigableUIContent) => {
    const locationManager = useLocationManager('detail display');
    const { url } = useStore();

    useEffect(() => {
        props.navControl.registerStateHooks({
            getLeaveQuestion: () => 'Do you really want to leave behind the details?',
        });
    }, []);

    return (
        <div>
            <div>
                We are at <b>{getParsedPathTokens({ ...props, locationManager }).join(' / ')}</b>
            </div>
            <div>
                Displaying content for topic <b>{url.something.value}</b>
            </div>
        </div>
    );
});
