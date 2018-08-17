import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, Select } from 'antd';
import { BindAntFormProps, BindAntProps, labelWithHelp, parseProps } from './BindAnt';
import { ManyOf } from '@moxb/moxb';
import { SelectProps } from 'antd/lib/select';

@observer
export class ManyOfAnt extends React.Component<BindAntProps<ManyOf> & SelectProps> {
    render() {
        const { operation, invisible, mode, children, defaultValue, label, help, placeholder, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);
        return (
            <Select
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={value}
                placeholder={placeholder}
                defaultValue={defaultValue}
                mode={typeof mode === 'undefined' ? 'default' : mode}
                {...props}
            >
                {operation.choices.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                    </Select.Option>
                ))}
                {children}
            </Select>
        );
    }
}

@observer
export class ManyOfFormAnt extends React.Component<BindAntFormProps & SelectProps & BindAntProps<ManyOf>> {
    render() {
        const { operation, label, help, invisible, formStyle, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Form.Item label={label} help={help} style={formStyle || undefined}>
                <ManyOfAnt operation={operation} {...props as any} />
            </Form.Item>
        );
    }
}
