import { CoreLinkProps, locationToUrl, UsesLocation, MyLocation } from '@moxb/moxb';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { AnchorParams } from '@moxb/html/dist/Anchor';
import { NavLink } from '@moxb/html';

/**
 * Everything except the actual target specification
 */
export interface NavLinkButtonAntParams extends AnchorParams {
    /**
     * Any extra properties to pass down to the button
     */
    buttonProps?: ButtonProps;
}

export type NavLinkButtonAntProps = NavLinkButtonAntParams & CoreLinkProps;

@inject('locationManager')
@observer
/**
 * A simple path-changing link component
 */
export class NavLinkButtonAnt extends React.Component<NavLinkButtonAntProps & UsesLocation> {
    public constructor(props: NavLinkButtonAntProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Calculate the location where these links should take us
     */
    protected getWantedLocation(): MyLocation {
        const { position, to, argChanges, appendTokens, removeTokenCount, toRef } = this.props;
        return this.props.locationManager!.getNewLocationForLinkProps({
            position,
            to,
            argChanges,
            appendTokens,
            removeTokenCount,
            toRef,
        });
    }

    protected handleClick() {
        const { locationManager, disabled } = this.props;
        if (!disabled) {
            locationManager!.trySetLocation(this.getWantedLocation());
        }
    }

    public render() {
        const { buttonProps: extraButtonProps = {}, children, ...remnants } = this.props;
        const url = locationToUrl(this.getWantedLocation());

        const { target } = this.props;

        const { label, className, disabled, style, title } = remnants;
        const buttonProps: ButtonProps = {
            onClick: target ? undefined : this.handleClick,
            className,
            disabled,
            title,
            style,
        };
        if (target) {
            // When the link target is set, we don't want to use a button for the navigation.
            // Instead, we will use a real HTML link on the button, and let the browser
            // handle the actual navigation step. (Which will open a new tab anyway.)
            const { to, position, appendTokens, removeTokenCount, argChanges, toRef } = this.props;
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
    }
}
