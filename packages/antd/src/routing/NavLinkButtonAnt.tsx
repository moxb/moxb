import { CoreLinkProps, locationToUrl, UsesLocation } from '@moxb/moxb';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { Path as MyLocation } from 'history';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { AnchorParams } from '@moxb/html/dist/Anchor';

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
     * Calculate the location where this links should take us
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

        const { label, className, disabled, style, title } = remnants;
        const buttonProps: ButtonProps = {
            onClick: this.handleClick,
            className,
            disabled,
            title,
            style,
        };
        return (
            <Button data-testid={url} {...(extraButtonProps as any)} {...buttonProps}>
                {label}
                {children}
            </Button>
        );
    }
}
