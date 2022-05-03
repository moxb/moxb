import { Action, Bind, OneOf } from '@moxb/moxb';
import { Button, Tooltip, Spin } from 'antd';
import { ButtonType } from 'antd/lib/button';
import { AbstractTooltipProps, RenderFunction } from 'antd/lib/tooltip';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ReactElement } from 'react';
import { BindMarkdownDiv } from './LabelAnt';

function toolTipText(action: Bind | Action) {
    let shortcuts = '';
    if ((action as Action).keyboardShortcuts) {
        shortcuts = (action as Action).keyboardShortcuts.map((s) => '(**' + s + '**)').join('\n\n');
    }
    return (action.label || action.help || '') + (shortcuts && '\n\n' + shortcuts);
}

// with the new antd version, we can no longer extend TooltipProps since it became a union type.
export interface BindToolTipAntProps extends AbstractTooltipProps {
    title?: React.ReactNode | RenderFunction;
    overlay?: React.ReactNode | RenderFunction;
    operation?: Bind | Action | OneOf;
    icon?: React.ReactNode;
    text?: string;
    type?: ButtonType;
}

export const ToolTipAnt = observer((props: BindToolTipAntProps) => {
    const { operation, children, placement, ...rest } = props;
    if (!operation) {
        return <>{children}</>;
    }
    const childrenWithProps = React.Children.map(children, (child) =>
        React.cloneElement(child as ReactElement, { operation, ...rest })
    );
    if (operation.disabled) {
        return <>{childrenWithProps}</>;
    } else {
        // Any cast was made because of wrong children type inside antd
        return (
            <Tooltip placement={placement || 'top'} title={<BindMarkdownDiv text={toolTipText(operation)} />}>
                {childrenWithProps as any}
            </Tooltip>
        );
    }
});

export const ToolTipButton = observer((props: BindToolTipAntProps) => {
    const { operation, icon, text, type } = props;
    if (operation!.invisible) {
        return null;
    }
    const { id, disabled, customData, reason } = operation!;
    const { fire, pending } = operation as Action;
    const selectedType = customData ? 'dashed' : 'ghost';
    if (disabled) {
        return (
            <span title={reason}>
                <Button
                    data-testid={id}
                    type={type || selectedType}
                    onClick={fire}
                    disabled={disabled}
                    htmlType="button"
                    icon={pending ? <Spin /> : icon}
                >
                    {text}
                </Button>
            </span>
        );
    } else {
        return (
            <ToolTipAnt operation={operation}>
                <Button
                    data-testid={id}
                    type={type || selectedType}
                    onClick={fire}
                    disabled={disabled}
                    htmlType="button"
                    icon={pending ? <Spin /> : icon}
                >
                    {text}
                </Button>
            </ToolTipAnt>
        );
    }
});
