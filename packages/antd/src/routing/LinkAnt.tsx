import { CoreLinkProps, locationToUrl, NavRef, NavRefCall, UsesLocation } from '@moxb/moxb';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { Path as MyLocation } from 'history';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as Anchor from '../not-antd/Anchor';

export interface LinkAntStyleProps {
    /**
     * How do you want to render this link? (Optional; defaults to "anchor")
     *
     * Supported values are:
     * - 'anchor',
     * - 'button',
     */
    widgetStyle?: string;

    /**
     * Any extra properties to pass down to the button
     */
    buttonProps?: ButtonProps;
}

export type LinkAntProps = Anchor.AnchorParams &
    CoreLinkProps &
    LinkAntStyleProps & {
        /**
         * Should this link point to a NavRef?
         *
         * When given, this will override to, appendTokens, etc..
         */
        toRef?: NavRef<void | {}> | NavRefCall<any>;
    };

type LinkProps = LinkAntProps & Anchor.Events;

@inject('locationManager')
@observer
/**
 * A simple path-changing link component
 */
export class LinkAnt extends React.Component<LinkProps & UsesLocation> {
    public constructor(props: LinkProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Calculate the location where this links should take us
     */
    protected getWantedLocation(): MyLocation {
        const { position, to, argChanges, appendTokens, removeTokenCount, toRef } = this.props;
        const locationManager = this.props.locationManager!;

        if (toRef) {
            // We have a NavRef. We are going to use that.
            if ((toRef as any).call) {
                // This is a NavRef object, not a call. We are supposed to execute it now.
                const navRef = toRef as NavRef<any>;
                const { location } = navRef.createDirectLink();
                return location;
            } else {
                // This ia a NavRefCall.
                const { navRef, tokens } = toRef as NavRefCall<any>;
                const { location } = navRef.createDirectLink(tokens);
                return location;
            }
        } else {
            // No navRef, so we will use the token-based parameters.
            const startLocation = appendTokens
                ? locationManager.getNewLocationForAppendedPathTokens(appendTokens)
                : removeTokenCount
                ? locationManager.getNewLocationForRemovedPathTokens(removeTokenCount)
                : locationManager.getNewLocationForPathAndQueryChanges(undefined, position, to, undefined);
            return (argChanges || []).reduce(
                (prevLocation: MyLocation, change) => change.arg.getModifiedLocation(prevLocation, change.value),
                startLocation
            );
        }
    }

    protected handleClick() {
        this.props.locationManager!.trySetLocation(this.getWantedLocation());
    }

    public render() {
        const { widgetStyle = 'anchor', buttonProps: extraButtonProps = {}, children, ...remnants } = this.props;
        const url = locationToUrl(this.getWantedLocation());
        switch (widgetStyle) {
            case 'anchor':
                const anchorProps: Anchor.UIProps = {
                    ...remnants,
                    href: url,
                    onClick: this.handleClick,
                };
                return <Anchor.Anchor {...anchorProps}>{children}</Anchor.Anchor>;
            case 'button':
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
            default:
                throw new Error('Unknown link style ' + widgetStyle);
        }
    }
}
