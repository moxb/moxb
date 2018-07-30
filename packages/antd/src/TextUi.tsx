import { observer } from 'mobx-react';
import * as React from 'react';
import { parseProps } from './BindUi';
import { Input, Form } from 'antd';
import { InputProps } from 'antd/lib/input';
import { Text } from '@moxb/moxb';
import { FormItemProps } from 'antd/lib/form/FormItem';

const FormItem = Form.Item;

export interface BindStringUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: Text;
    useDoubleClickToEdit?: boolean;
    help?: string;
}

@observer
export class TextUi extends React.Component<InputProps & BindStringUiProps> {
    render() {
        const { operation, id, type, value, size, invisible } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Input
                id={id}
                type={type || operation.inputType || 'text'}
                placeholder={operation.placeholder}
                onFocus={operation.onEnterField}
                onBlur={operation.onExitField}
                value={operation.value || value || ''}
                onChange={(e: any) => operation.setValue(e.target.value)}
                size={size}
            />
        );
    }
}

@observer
export class TextFormUi extends React.Component<FormItemProps & BindStringUiProps> {
    render() {
        const { operation, label, invisible } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItem label={label != null ? label : operation.label}>
                <TextUi operation={operation} />
            </FormItem>
        );
    }
}
