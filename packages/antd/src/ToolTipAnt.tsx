import { Action, Bind, OneOf } from '@moxb/moxb';
import { Button, Tooltip } from 'antd';
import { ButtonType } from 'antd/lib/button';
import { AbstractTooltipProps, RenderFunction } from 'antd/lib/tooltip';
import { observer } from 'mobx-react';
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

@observer
export class ToolTipAnt extends React.Component<BindToolTipAntProps> {
    render() {
        const { operation, children, placement, ...props } = this.props;
        if (!operation) {
            return children;
        }
        const childrenWithProps = React.Children.map(children, (child) =>
            React.cloneElement(child as ReactElement, { operation, ...props })
        );
        if (operation.disabled) {
            return <>{childrenWithProps}</>;
        } else {
            return (
                <Tooltip placement={placement || 'top'} title={<BindMarkdownDiv text={toolTipText(operation)} />}>
                    {childrenWithProps}
                </Tooltip>
            );
        }
    }
}

@observer
export class ToolTipButton extends React.Component<BindToolTipAntProps> {
    render() {
        const { operation, icon, text, type } = this.props;
        if (operation!.invisible) {
            return null;
        }
        const selectedType = operation!.customData ? 'dashed' : 'ghost';
        if (operation!.disabled) {
            return (
                <Button
                    data-testid={operation!.id}
                    type={type || selectedType}
                    onClick={(operation as Action).fire}
                    disabled={operation!.disabled}
                    htmlType="button"
                    icon={icon}
                >
                    {text}
                </Button>
            );
        } else {
            return (
                <ToolTipAnt operation={operation}>
                    <Button
                        data-testid={operation!.id}
                        type={type || selectedType}
                        onClick={(operation as Action).fire}
                        disabled={operation!.disabled}
                        htmlType="button"
                        icon={icon}
                    >
                        {text}
                    </Button>
                </ToolTipAnt>
            );
        }
    }
}
