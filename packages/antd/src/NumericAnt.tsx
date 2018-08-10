import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, InputNumber } from 'antd';
import { BindAntProps, labelWithHelp, parseProps } from './BindAnt';
import { Numeric } from '@moxb/moxb';
import { InputNumberProps } from 'antd/lib/input-number';
import { FormItemProps } from 'antd/lib/form/FormItem';

@observer
export class NumericAnt extends React.Component<BindAntProps<Numeric> & InputNumberProps> {
    render() {
        const { operation, id, invisible, size, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <InputNumber
                id={id}
                type={operation.inputType || this.props.type || 'number'}
                step={operation.step}
                min={operation.min}
                max={operation.max}
                value={operation.value}
                size={size as any}
                placeholder="Interval"
                onChange={value => operation.setValue(parseInt(value as string))}
                {...props}
            />
        );
    }
}

@observer
export class NumericFormAnt extends React.Component<BindAntProps<Numeric> & InputNumberProps & FormItemProps> {
    render() {
        const { operation, label, invisible, prefix } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Form.Item label={labelWithHelp(label != null ? label : operation.label, operation.help)}>
                <NumericAnt operation={operation} prefix={prefix} />
            </Form.Item>
        );
    }
}
