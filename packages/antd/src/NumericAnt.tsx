import { observer } from 'mobx-react';
import * as React from 'react';
import { InputNumber } from 'antd';
import { BindAntProps, parseProps } from './BindAnt';
import { InputNumberProps } from 'antd/lib/input-number';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';
import { Numeric } from '@moxb/moxb';

@observer
export class NumericAnt extends React.Component<BindAntProps<Numeric> & InputNumberProps> {
    render() {
        const { operation, id, invisible, size, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <span>
                <InputNumber
                    id={id}
                    step={operation.step}
                    min={operation.min}
                    max={operation.max}
                    value={operation.value}
                    size={size as any}
                    placeholder={operation.placeholder || 'Interval'}
                    onChange={value => {
                        operation.setValue(parseInt(value as string));
                        operation.onExitField();
                    }}
                    {...props}
                />
                {operation.unit && ' ' + operation.unit}
            </span>
        );
    }
}

@observer
export class NumericFormAnt extends React.Component<BindAntProps<Numeric> & InputNumberProps & FormItemProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...this.props as any}>
                <NumericAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
