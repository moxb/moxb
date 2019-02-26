import { OneOf } from '@moxb/moxb';
import { Radio, Select } from 'antd';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { RadioGroupProps, RadioProps } from 'antd/lib/radio';
import { SelectProps } from 'antd/lib/select';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { BindFormItemAntProps, FormItemAnt, parsePropsForChild } from './FormItemAnt';

@observer
export class OneOfAnt extends React.Component<BindAntProps<OneOf> & RadioProps & RadioGroupProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Radio.Group onChange={e => operation.setValue(e.target.value)} {...props} value={operation.value}>
                {operation.choices.map(opt => (
                    <Radio key={opt.value} value={opt.value}>
                        {opt.widget ? opt.widget : opt.label}
                    </Radio>
                ))}
            </Radio.Group>
        );
    }
}

@observer
export class OneOfFormAnt extends React.Component<BindAntProps<OneOf> & RadioProps & FormItemProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <OneOfAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

@observer
export class OneOfButtonAnt extends React.Component<BindAntProps<OneOf> & RadioProps & RadioGroupProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Radio.Group onChange={e => operation.setValue(e.target.value)} {...props} value={operation.value}>
                {operation.choices.map(opt => (
                    <Radio.Button key={opt.value} value={opt.value}>
                        {opt.widget ? opt.widget : opt.label}
                    </Radio.Button>
                ))}
            </Radio.Group>
        );
    }
}

@observer
export class OneOfButtonFormAnt extends React.Component<
    BindAntProps<OneOf> & RadioProps & RadioGroupProps & FormItemProps
> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <OneOfButtonAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

@observer
export class OneOfSelectAnt extends React.Component<BindAntProps<OneOf> & SelectProps> {
    render() {
        const { operation, invisible, value, placeholder, mode, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        return (
            <Select
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={this.props.operation.value || ''}
                placeholder={placeholder}
                mode={mode || 'default'}
                {...props}
            >
                {operation.choices.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>
                        {opt.widget ? opt.widget : opt.label}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}

@observer
export class OneOfSelectFormAnt extends React.Component<BindAntProps<OneOf> & BindFormItemAntProps & SelectProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <OneOfSelectAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
