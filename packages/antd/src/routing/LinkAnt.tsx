import { QueryChange, UpdateMethod, UrlArg, UsesLocation } from '@moxb/moxb';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as Anchor from '../not-antd/Anchor';

export interface ArgChange<T> {
    arg: UrlArg<T>;
    value: T;
}

export interface LinkAntProps extends Anchor.AnchorParams {
    /**
     * The path tokens to set
     */
    to?: string[];

    /**
     * Set the number of tokens to be preserved. further tokens will be dropped.
     */
    position?: number;

    /**
     * Do we have to set any URL arguments?
     */
    argChanges?: ArgChange<any>[];

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

    protected _getRealChanges(): QueryChange[] | undefined {
        const { argChanges } = this.props;
        if (!argChanges) {
            return undefined;
        }
        return argChanges.map(
            (change): QueryChange => ({
                key: change.arg.key,
                value: change.arg.getRawValue(change.value),
            })
        );
    }

    protected handleClick() {
        const { locationManager, to, position } = this.props;
        if (to) {
            if (to) {
                locationManager!.setPathTokens(position || 0, to);
            }
            const changes = this._getRealChanges();
            if (changes) {
                locationManager!.setQueries(changes, to ? UpdateMethod.REPLACE : UpdateMethod.PUSH);
            }
        }
    }

    public render() {
        const {
            locationManager,
            to,
            argChanges,
            position,
            widgetStyle = 'anchor',
            buttonProps: extraButtonProps = {},
            children,
            ...remnants
        } = this.props;
        const url = locationManager!.getURLForPathAndQueryChanges(position || 0, to, this._getRealChanges());
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
