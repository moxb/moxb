import { observer } from 'mobx-react';
import * as React from 'react';
import { labelWithHelp, parseProps } from './BindUi';
import { Input, Form } from 'antd';
import { InputProps } from 'antd/lib/input';
import { Text } from '@moxb/moxb';
import { FormItemProps } from 'antd/lib/form/FormItem';

const FormItem = Form.Item;
const { TextArea } = Input;

export interface BindStringUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: Text;
    useDoubleClickToEdit?: boolean;
    help?: string;
}

@observer
export class TextUi extends React.Component<InputProps & BindStringUiProps> {
    render() {
        const { operation, id, type, value, size, prefix, invisible } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        if ((type || operation.inputType) === 'textarea') {
            return (
                <TextArea
                    id={id}
                    placeholder={operation.placeholder}
                    onFocus={operation.onEnterField}
                    onBlur={operation.onExitField}
                    value={operation.value || value || ''}
                    prefix={prefix}
                    onChange={(e: any) => operation.setValue(e.target.value)}
                    rows={this.props.rows}
                />
            );
        } else {
            return (
                <Input
                    id={id}
                    placeholder={operation.placeholder}
                    onFocus={operation.onEnterField}
                    onBlur={operation.onExitField}
                    value={operation.value || value || ''}
                    prefix={prefix}
                    onChange={(e: any) => operation.setValue(e.target.value)}
                    size={size}
                />
            );
        }
    }
}

@observer
export class TextFormUi extends React.Component<FormItemProps & BindStringUiProps> {
    render() {
        const { operation, label, invisible, prefix } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItem label={labelWithHelp(label != null ? label : operation.label, operation.help)}>
                <TextUi operation={operation} prefix={prefix} />
            </FormItem>
        );
    }
}
