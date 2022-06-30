import * as React from 'react';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { getNextPathToken, Navigable, parseNavRef, UpdateMethod } from '@moxb/stellar-router-core';

import { useLocationManager, useLinkGenerator } from './routingProviders';

/**
 * The NavRefRedirect component is responsible for executing redirects based on base64-encoded
 * NavRef links.
 *
 * Just put it into a menu (under the preferred url prefix used for the redirects),
 * and it will handle the rest. I.e.
 *
 *  {
 *     key: 'redirects',
 *     hidden: true,
 *     fragment: NavRefRedirect,
 *  },
 *
 */
export const NavRefRedirect = observer((props: Navigable<any>) => {
    const locationManager = useLocationManager('nav ref redirect');
    const linkGenerator = useLinkGenerator();

    if (!linkGenerator) {
        throw new Error(
            'Link generator is missing! Have you passed in the state space when creating the routing store?'
        );
    }

    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setFailed(false);
        try {
            // Get the data out of the next path token
            const stringForm = getNextPathToken({ ...props, locationManager });

            // Parse the base64 data into a NavRefCall data structure
            const { navRef, tokens } = parseNavRef(stringForm);

            // Go to this NavRef
            linkGenerator.doGoTo(navRef.call(tokens), UpdateMethod.REPLACE);
        } catch (e) {
            setFailed(true);
            console.log(e);
        }
    });

    return failed ? <div>Oops! This redirect doesn't seem to be working.</div> : <div>Redirecting...</div>;
});
