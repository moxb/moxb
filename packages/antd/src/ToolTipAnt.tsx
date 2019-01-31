import { Action, Bind } from '@moxb/moxb';
import { Button, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { ReactElement } from 'react';
import * as React from 'react';
import { BindMarkdownDiv } from './LabelAnt';

function toolTipText(action: Bind | Action) {
    let shortcuts = '';
    if ((action as Action).keyboardShortcuts) {
        shortcuts = (action as Action).keyboardShortcuts.map(s => '(**' + s + '**)').join('\n\n');
    }
    return (action.label || action.help || '') + (shortcuts && '\n\n' + shortcuts);
}

@observer
export class ToolTipAnt extends React.Component<{
    operation?: Bind;
    icon?: string;
    text?: string;
    type?: string;
    placement?: any;
}> {
    render() {
        const { operation, children, placement } = this.props;
        if (!operation) {
            return children;
        }
        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child as ReactElement<any>, { operation })
        );
        return (
            <Tooltip placement={placement || 'top'} title={<BindMarkdownDiv text={toolTipText(operation)} />}>
                {childrenWithProps}
            </Tooltip>
        );
    }
}

@observer
export class ToolTipButton extends React.Component<{
    operation: Action;
    icon?: string;
    text?: string;
    type?: string;
}> {
    render() {
        const { operation, icon, text } = this.props;
        const type = operation.customData ? 'dashed' : 'ghost';
        return (
            <ToolTipAnt operation={operation}>
                <Button type={type} onClick={operation.fire} disabled={operation.disabled} icon={icon}>
                    {text}
                </Button>
            </ToolTipAnt>
        );
    }
}
