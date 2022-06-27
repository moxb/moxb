import * as React from 'react';
import { CoreLinkProps, locationToUrl } from '@moxb/stellar-router-core';

import * as Anchor from '@moxb/react-html';
import { observer } from 'mobx-react-lite';
import { useLocationManager } from './routingProviders';

/**
 * Everything _except_ the target specification
 */
export type NavLinkParams = Anchor.AnchorParams;

/**
 * All the props (presentation and target)
 */
export type NavLinkProps = NavLinkParams & CoreLinkProps;

export const NavLink = observer((props: NavLinkProps) => {
    const locationManager = useLocationManager('nav link');
    const { position, to, argChanges, appendTokens, removeTokenCount, toRef } = props;
    const wantedLocation = locationManager.getNewLocationForLinkProps({
        position,
        to,
        argChanges,
        appendTokens,
        removeTokenCount,
        toRef,
    });

    function handleClick() {
        locationManager.trySetLocation(wantedLocation);
    }

    const { children, ...rest } = props;
    const { target } = props;
    return (
        <Anchor.Anchor href={locationToUrl(wantedLocation)} onClick={target ? undefined : handleClick} {...rest}>
            {children}
        </Anchor.Anchor>
    );
});