import { Numeric } from '@moxb/moxb';
import { InputNumber } from 'antd';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { InputNumberProps } from 'antd/lib/input-number';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

export const NumericAnt = observer(
    class NumericAnt extends React.Component<BindAntProps<Numeric> & InputNumberProps> {
        render() {
            const { operation, id, invisible, size, reason, ...props } = parseProps(this.props, this.props.operation);
            if (invisible) {
                return null;
            }

            const formatter = operation.unit ? (value?: number | string) => `${value}${operation.unit}` : undefined;
            const parser = operation.unit
                ? (value?: string) =>
                      operation.step && !Number.isInteger(operation.step)
                          ? parseFloat(value!.replace(`${operation.unit}`, '') || '0')
                          : parseInt(value!.replace(`${operation.unit}`, '') || '0')
                : undefined;

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
                        const newValue = value
                            ? operation.step && !Number.isInteger(operation.step)
                                ? parseFloat(value + '')
                                : parseInt(value + '')
                            : 0;
                        operation.setValue(newValue);
                        operation.onExitField();
                    }}
                    {...props}
                />
            );
        }
    }
);

export const NumericFormAnt = observer(
    class NumericFormAnt extends React.Component<BindAntProps<Numeric> & InputNumberProps & Partial<FormItemProps>> {
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
);
