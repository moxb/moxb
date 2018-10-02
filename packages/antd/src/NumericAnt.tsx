import { observer } from 'mobx-react';
import * as React from 'react';
import { InputNumber } from 'antd';
import { BindAntProps, parseProps } from './BindAnt';
import { InputNumberProps } from 'antd/lib/input-number';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { FormItemAnt } from './FormItemAnt';
import { Numeric } from '@moxb/moxb';

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
                step={operation.step}
                min={operation.min}
                max={operation.max}
                value={operation.value}
                size={size as any}
                placeholder="Interval"
                onChange={value => {
                    operation.setValue(parseInt(value as string));
                    operation.onExitField();
                }}
                {...props}
            />
        );
    }
}

@observer
export class NumericFormAnt extends React.Component<BindAntProps<Numeric> & InputNumberProps & FormItemProps> {
    render() {
        const { operation, label, invisible, formStyle, labelCol, wrapperCol, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt
                operation={operation}
                label={label}
                formStyle={formStyle}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
            >
                <NumericAnt operation={operation} {...props as any} />
            </FormItemAnt>
        );
    }
}
