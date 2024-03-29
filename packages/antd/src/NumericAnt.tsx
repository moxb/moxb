import { Numeric } from '@moxb/moxb';
import { InputNumber } from 'antd';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { InputNumberProps } from 'antd/lib/input-number';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { BindAntProps, parseProps } from './BindAnt';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

export const NumericAnt = observer((props: BindAntProps<Numeric> & InputNumberProps) => {
    const { operation, id, invisible, size, reason, ...rest } = parseProps(props, props.operation);
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
            {...rest}
        />
    );
});

export const NumericFormAnt = observer((props: BindAntProps<Numeric> & InputNumberProps & Partial<FormItemProps>) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <NumericAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});
