import { observer } from 'mobx-react';
import * as React from 'react';
import { Button, Dropdown, DropdownProps, Form, FormButtonProps } from 'semantic-ui-react';
import { BindUiProps, parseProps } from '../bind/BindUi';
import { Action } from './Action';

export type BindActionUiProps = BindUiProps<Action> & FormButtonProps;

@observer
export class ActionUi extends React.Component<BindActionUiProps> {
    render() {
        const { operation, id, label, invisible, children, color, size, width, ...props } = parseProps(this.props);
        if (invisible || operation.invisible) {
            return null;
        }
        // color, size and width cause problems when in ...props
        return (
            <Form.Button
                id={id}
                onClick={operation.fire}
                {...props}
                color={color as any}
                size={size as any}
                width={width as any}
            >
                {children || label}
            </Form.Button>
        );
    }
}

@observer
export class ActionButtonUi extends React.Component<BindActionUiProps> {
    render() {
        const { operation, id, label, invisible, children, color, size, width, ...props } = parseProps(this.props);
        if (invisible || operation.invisible) {
            return null;
        }
        // color, size and width cause problems when in ...props
        return (
            <Button
                id={id}
                onClick={operation.fire}
                {...props}
                color={color as any}
                size={size as any}
                width={width as any}
            >
                {children || label}
            </Button>
        );
    }
}
@observer
export class ActionDropdownItemUi extends React.Component<BindUiProps<Action> & DropdownProps> {
    render() {
        const { operation, id, label, invisible, children, ...props } = parseProps(this.props);
        if (invisible || operation.invisible) {
            return null;
        }
        // color, size and width cause problems when in ...props
        return (
            <Dropdown.Item id={id} onClick={operation.fire} {...props as any}>
                {children || label}
            </Dropdown.Item>
        );
    }
}
