import { Action } from '@moxb/moxb';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Button, Dropdown, DropdownProps, Form, FormButtonProps } from 'semantic-ui-react';
import { BindUiProps, parseProps } from './BindUi';

export type ActionUiProps = BindUiProps<Action> &
    FormButtonProps & {
        type?: 'button' | 'submit' | 'reset';
    };

export const ActionFormButtonUi = observer((props: ActionUiProps) => {
    const { operation, id, label, invisible, children, color, size, width, ...rest } = parseProps(props);
    if (invisible || operation.invisible) {
        return null;
    }
    // color, size and width cause problems when in ...props
    return (
        <Form.Button
            id={id}
            onClick={operation.fire}
            {...rest}
            color={color as any}
            size={size as any}
            width={width as any}
        >
            {children || label}
        </Form.Button>
    );
});

export const ActionButtonUi = observer((props: ActionUiProps) => {
    const { operation, id, label, invisible, children, color, size, width, ...rest } = parseProps(props);
    if (invisible || operation.invisible) {
        return null;
    }
    // color, size and width cause problems when in ...props
    return (
        <Button
            id={id}
            onClick={operation.fire}
            {...rest}
            color={color as any}
            size={size as any}
            width={width as any}
            loading={operation.pending}
        >
            {children || label}
        </Button>
    );
});

export const ActionDropdownItemUi = observer((props: BindUiProps<Action> & DropdownProps) => {
    const { operation, id, label, invisible, children, ...rest } = parseProps(props);
    if (invisible || operation.invisible) {
        return null;
    }
    // color, size and width cause problems when in ...props
    return (
        <Dropdown.Item id={id} onClick={operation.fire} {...(rest as any)}>
            {children || label}
        </Dropdown.Item>
    );
});
