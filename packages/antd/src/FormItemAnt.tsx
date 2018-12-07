import { Form } from 'antd';
import { ColProps } from 'antd/lib/grid';
import { CSSProperties } from 'react';
import * as React from 'react';
import { observer } from 'mobx-react';
import { parseProps, labelWithHelp, getErrorMessages } from './BindAnt';
import { FormItem as MoxFormItem } from '@moxb/moxb';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { BindMarkdownDiv } from './LabelAnt';

export interface BindFormItemAntProps extends FormItemProps {
    operation: MoxFormItem;
    formStyle?: CSSProperties;
    wrapperCol?: ColProps;
    labelCol?: ColProps;
    label?: string;
}

@observer
export class FormItemAnt extends React.Component<BindFormItemAntProps> {
    render() {
        const { operation, id, children, label, formStyle, labelCol, wrapperCol, invisible, extra } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        return (
            <Form.Item
                id={id + '-formItem'}
                label={labelWithHelp(label, operation.help)}
                style={formStyle || undefined}
                extra={extra ? <BindMarkdownDiv text={extra!.toString()} /> : null}
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
    return props;
}
