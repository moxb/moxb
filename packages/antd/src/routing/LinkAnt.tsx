import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as Anchor from '../not-antd/Anchor';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { UsesLocation } from '@moxb/moxb';

export interface LinkAntProps extends Anchor.AnchorParams {
    /**
     * The path tokens to set
     */
    to: string[];

    /**
     * Set the number of tokens to be preserved. further tokens will be dropped.
     */
    position?: number;

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

    protected handleClick() {
        const { locationManager, to, position } = this.props;
        locationManager!.setPathTokens(position || 0, to);
    }

    public render() {
        const {
            locationManager,
            to,
            position,
            widgetStyle = 'anchor',
            buttonProps: extraButtonProps = {},
            children,
            ...remnants
        } = this.props;
        const url = locationManager!.getURLForPathTokens(position || 0, to);
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
                    <Button {...extraButtonProps as any} {...buttonProps}>
                        {label}
                        {children}
                    </Button>
                );
            default:
                throw new Error('Unknown link style ' + widgetStyle);
        }
    }
}
