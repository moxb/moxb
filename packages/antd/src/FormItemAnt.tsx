import { FormItem as MoxFormItem } from '@moxb/moxb';
import { Form } from 'antd';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { ColProps } from 'antd/lib/grid';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { CSSProperties } from 'react';
import { getErrorMessages, labelWithHelpSpan, parseProps } from './BindAnt';
import { BindMarkdownDiv } from './LabelAnt';

// Due to the recent antd changes the children property in the FormItemProps component
// became mandatory which is invalid
export interface BindFormItemAntProps extends Partial<FormItemProps> {
    operation: Pick<MoxFormItem, 'invisible' | 'required' | 'hasErrors' | 'errors' | 'help'>;
    formStyle?: CSSProperties;
    wrapperCol?: ColProps;
    labelCol?: ColProps;
    label?: string;
    extraMarkdown?: string;
}

export const FormItemAnt = observer((props: BindFormItemAntProps) => {
    const {
        operation,
        id,
        children,
        label,
        help,
        formStyle,
        labelCol,
        wrapperCol,
        invisible,
        extra,
        extraMarkdown,
    } = parseProps(props, props.operation);
    if (invisible) {
        return null;
    }
    const extraLabel = extraMarkdown && !extra ? <BindMarkdownDiv text={extraMarkdown} /> : extra;
    const fullId = id + '-formItem';
    return (
        <Form.Item
            htmlFor={fullId}
            data-testid={fullId}
            label={labelWithHelpSpan(label, help)}
            style={formStyle || undefined}
            extra={extraLabel}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            required={operation.required}
            hasFeedback={operation.hasErrors}
            validateStatus={operation.hasErrors ? 'error' : undefined}
            help={operation.hasErrors ? getErrorMessages(operation.errors!) : null}
        >
            {children}
        </Form.Item>
    );
});

/**
 * This function filters out the props, which are not needed by a FormItem children.
 * It only passes the necessary props along to the children.
 */
export function parsePropsForChild<T, O>(bindProps: T, op: O): T & O {
    const { label, formStyle, labelCol, wrapperCol, ...props } = parseProps(bindProps, op) as any;
    return props as T & O;
}
