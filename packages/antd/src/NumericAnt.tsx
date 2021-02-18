import { Numeric } from '@moxb/moxb';
import { InputNumber } from 'antd';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { InputNumberProps } from 'antd/lib/input-number';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

@observer
export class NumericAnt extends React.Component<BindAntProps<Numeric> & InputNumberProps> {
    render() {
        const { operation, id, invisible, size, reason, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        const formatter = (value?: number | string) => (operation.unit ? `${value}${operation.unit}` : `${value}`);
        const parser = (value?: string) =>
            operation.unit ? parseInt(value!.replace(`${operation.unit}`, '') || '0') : parseInt(value || '0');
        return (
            <InputNumber
                title={reason}
                id={id}
                data-testid={operation.id}
                step={operation.step}
                min={operation.min}
                max={operation.max}
                value={operation.value}
                size={size as any}
                placeholder={operation.placeholder || 'Interval'}
                formatter={formatter}
                parser={parser}
                onChange={(value) => {
                    operation.setValue(parseInt(value ? value + '' : '0'));
                    operation.onExitField();
                }}
                {...props}
            />
        );
    }
}

@observer
export class NumericFormAnt extends React.Component<BindAntProps<Numeric> & InputNumberProps & Partial<FormItemProps>> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <NumericAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
