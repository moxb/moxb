import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { BindAntProps, parseProps } from './BindAnt';
import { Rate } from '@moxb/moxb';
import { Rate as RateComponent } from 'antd';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

export const RateAnt = observer((props: BindAntProps<Rate>) => {
    const { operation, id, invisible, help, reason, ...rest } = parseProps(props, props.operation);
    if (invisible) {
        return null;
    }

    return (
        <span title={reason || help}>
            <RateComponent
                data-testid={operation.id}
                onChange={(value) => {
                    operation.setValue(value);
                    operation.onExitField();
                }}
                value={operation.value}
                {...rest}
            />
            {operation.showValueLabel && !!operation.value ? (
                <span className="ant-rate-text">{operation.tooltips[operation.value - 1]}</span>
            ) : (
                ''
            )}
        </span>
    );
});

export const RateFormAnt = observer((props: BindAntProps<Rate> & Partial<FormItemProps>) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }

    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <RateAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});
