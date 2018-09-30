import { ColProps } from 'antd/lib/grid';
import { CSSProperties } from 'react';
import * as React from 'react';
import { observer } from 'mobx-react';
import { BindAntProps, parseProps } from './BindAnt';
import { Action } from '@moxb/moxb';
import { Button, Form } from 'antd';
import { ButtonSize, ButtonType, ButtonShape } from 'antd/lib/button';
import { NativeButtonProps } from 'antd/lib/button/button';

const FormItem = Form.Item;
export type BindActionAntProps = BindAntProps<Action> & NativeButtonProps;

export interface ActionFormButtonAntProps extends BindActionAntProps {
    formStyle?: CSSProperties;
    wrapperCol?: ColProps;
    labelCol?: ColProps;
}

@observer
export class ActionButtonAnt extends React.Component<BindActionAntProps> {
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
export class ActionFormButtonAnt extends React.Component<ActionFormButtonAntProps> {
    render() {
        const { operation, invisible, formStyle, labelCol, wrapperCol, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        return (
            <FormItem
                style={formStyle || undefined}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                hasFeedback={operation.errors != null}
                validateStatus={operation.errors != null ? 'error' : undefined}
            >
                <ActionButtonAnt operation={this.props.operation} htmlType="submit" {...props as any} />
            </FormItem>
        );
    }
}
