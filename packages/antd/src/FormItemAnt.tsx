import { Form } from 'antd';
import { ColProps } from 'antd/lib/grid';
import { CSSProperties } from 'react';
import * as React from 'react';
import { observer } from 'mobx-react';
import { parseProps, labelWithHelp, getErrorMessages } from './BindAnt';
import { FormItem as MoxFormItem } from '@moxb/moxb';
import { FormItemProps } from 'antd/lib/form/FormItem';

export interface BindFormItemAntProps extends React.HTMLProps<HTMLFormElement> {
    operation: MoxFormItem;
    formStyle?: CSSProperties;
    wrapperCol?: ColProps;
    labelCol?: ColProps;
    label?: string;
}

@observer
export class FormItemAnt extends React.Component<FormItemProps & BindFormItemAntProps> {
    render() {
        const { operation, children, label, formStyle, labelCol, wrapperCol, invisible, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        return (
            <Form.Item
                label={labelWithHelp(label != null ? label : operation.label, operation.help)}
                style={formStyle || undefined}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                required={operation.required}
                hasFeedback={operation.hasErrors}
                validateStatus={operation.hasErrors ? 'error' : undefined}
                help={operation.hasErrors ? getErrorMessages(operation.errors!) : null}
                {...props as any}
            >
                {children}
            </Form.Item>
        );
    }
}
