import * as React from 'react';
import { observer } from 'mobx-react';
import { BindUiProps, parseProps } from './BindUi';
import { Action } from '@moxb/moxb';
import { Button, Form } from 'antd';
import { ButtonSize, ButtonType, ButtonShape } from 'antd/lib/button';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { NativeButtonProps } from 'antd/lib/button/button';

const FormItem = Form.Item;
export type BindActionUiProps = BindUiProps<Action> & NativeButtonProps;

@observer
export class ActionButtonUi extends React.Component<BindActionUiProps> {
    render() {
        const { operation, invisible, children, label, id, size, shape, htmlType, type, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        return (
            <Button
                id={id}
                onClick={operation.fire}
                {...props}
                size={size as ButtonSize}
                shape={shape as ButtonShape}
                type={type as ButtonType}
                htmlType={typeof htmlType === 'undefined' ? 'button' : htmlType}
            >
                {children != null ? children : label}
            </Button>
        );
    }
}

@observer
export class ActionFormButtonUi extends React.Component<BindUiProps<Action> & FormItemProps & NativeButtonProps> {
    render() {
        return (
            <FormItem>
                <ActionButtonUi operation={this.props.operation} htmlType="submit" />
            </FormItem>
        );
    }
}
