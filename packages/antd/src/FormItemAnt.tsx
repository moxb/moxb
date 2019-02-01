import { FormItem as MoxFormItem } from '@moxb/moxb';
import { Form } from 'antd';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { ColProps } from 'antd/lib/grid';
import { observer } from 'mobx-react';
import * as React from 'react';
import { CSSProperties } from 'react';
import { getErrorMessages, labelWithHelp, parseProps } from './BindAnt';
import { BindMarkdownDiv } from './LabelAnt';

export interface BindFormItemAntProps extends FormItemProps {
    operation: MoxFormItem;
    formStyle?: CSSProperties;
    wrapperCol?: ColProps;
    labelCol?: ColProps;
    label?: string;
    extraMarkdown?: string;
}

@observer
export class FormItemAnt extends React.Component<BindFormItemAntProps> {
    render() {
        const {
            operation,
            id,
            children,
            label,
            formStyle,
            labelCol,
            wrapperCol,
            invisible,
            extra,
            extraMarkdown,
        } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        const extraLabel = extraMarkdown && !extra ? <BindMarkdownDiv text={extraMarkdown} /> : extra;
        return (
            <Form.Item
                id={id + '-formItem'}
                label={labelWithHelp(label, operation.help)}
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
    }
}

/**
 * This function filters out the props, which are not needed by a FormItem children.
 * It only passes the necessary props along to the children.
 */
export function parsePropsForChild<T, O>(bindProps: T, op: O): T & O {
    // @ts-ignore
    const { label, formStyle, labelCol, wrapperCol, ...props } = parseProps(bindProps, op);
    return props as (T & O);
}
