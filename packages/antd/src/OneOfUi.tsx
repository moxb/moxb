import { observer } from 'mobx-react';
import * as React from 'react';
import { Select, Radio, Form } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { RadioProps } from 'antd/lib/radio';
import { BindUiProps, labelWithHelp, parseProps } from './BindUi';
import { OneOf } from '@moxb/moxb';
import { FormItemProps } from 'antd/lib/form/FormItem';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

@observer
export class OneOfUi extends React.Component<BindUiProps<OneOf> & RadioProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <RadioGroup onChange={(selectionValue: any) => operation.setValue(selectionValue)} {...props}>
                {operation.choices.map(opt => (
                    <Radio key={opt.value} value={opt.value} checked={opt.value === operation.value}>
                        {opt.label}
                    </Radio>
                ))}
            </RadioGroup>
        );
    }
}

@observer
export class OneOfFormUi extends React.Component<BindUiProps<OneOf> & RadioProps & FormItemProps> {
    render() {
        const { operation, label, invisible } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItem label={labelWithHelp(label != null ? label : operation.label, operation.help)}>
                <OneOfUi operation={operation} />
            </FormItem>
        );
    }
}

@observer
export class OneOfSelectUi extends React.Component<BindUiProps<OneOf> & SelectProps> {
    render() {
        const { operation, invisible, value, placeholder, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Select
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                defaultValue={operation.value}
                value={value}
                placeholder={placeholder}
                mode="default"
                {...props}
            >
                {operation.choices.map(opt => (
                    <Option key={opt.value} value={opt.value}>
                        {opt.label}
                    </Option>
                ))}
            </Select>
        );
    }
}

@observer
export class OneOfSelectFormUi extends React.Component<BindUiProps<OneOf> & RadioProps & FormItemProps> {
    render() {
        const { operation, label, invisible } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItem label={labelWithHelp(label != null ? label : operation.label, operation.help)}>
                <OneOfSelectUi operation={operation} />
            </FormItem>
        );
    }
}
