import { CoreLinkProps, locationToUrl, useLocationManager } from '@moxb/moxb';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { NavLink, AnchorParams } from '@moxb/react-html';

/** * Everything except the actual target specification
 */
export interface NavLinkButtonAntParams extends AnchorParams {
    /**
     * Any extra properties to pass down to the button
     */
    buttonProps?: ButtonProps;
}

export type NavLinkButtonAntProps = NavLinkButtonAntParams & CoreLinkProps;

/**
 * A simple path-changing link component
 */
export const NavLinkButtonAnt = observer((props: NavLinkButtonAntProps) => {
    const locationManager = useLocationManager('nav link button');

    /**
     * Calculate the location where these links should take us
     */
    const { position, to, argChanges, appendTokens, removeTokenCount, toRef } = props;

    const wantedLocation = locationManager.getNewLocationForLinkProps({
        position,
        to,
        argChanges,
        appendTokens,
        removeTokenCount,
        toRef,
    });

    const url = locationToUrl(wantedLocation);

    const { buttonProps: extraButtonProps = {}, children, ...rest } = props;

    const { label, className, disabled, style, title } = rest;

    function handleClick() {
        if (!disabled) {
            locationManager.trySetLocation(wantedLocation);
        }
    }

    const { target } = props;

    const buttonProps: ButtonProps = {
        onClick: target ? undefined : handleClick,
        className,
        disabled,
        title,
        style,
    };
    if (target) {
        // When the link target is set, we don't want to use a button for the navigation.
        // Instead, we will use a real HTML link on the button, and let the browser
        // handle the actual navigation step. (Which will open a new tab anyway.)
        return (
            <Button data-testid={url} {...(extraButtonProps as any)} {...buttonProps}>
                <NavLink
                    target={target}
                    label={label}
                    to={to}
                    position={position}
                    appendTokens={appendTokens}
                    removeTokenCount={removeTokenCount}
                    argChanges={argChanges}
                    toRef={toRef}
                    disabled={disabled}
                >
                    {children}
                </NavLink>
            </Button>
        );
    }
    return (
        <Button data-testid={url} {...(extraButtonProps as any)} {...buttonProps}>
            {label}
            {children}
        </Button>
    );
});
