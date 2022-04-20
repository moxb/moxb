import * as React from 'react';
import { observer } from 'mobx-react';
import { BindAntProps, parseProps } from './BindAnt';
import { Rate } from '@moxb/moxb';
import { Rate as RateComponent } from 'antd';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

export const RateAnt = observer(class RateAnt extends React.Component<BindAntProps<Rate>> {
    render() {
        const { operation, id, invisible, help, reason, ...props } = parseProps(this.props, this.props.operation);
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
                    {...props}
                />
                {operation.showValueLabel && !!operation.value ? (
                    <span className="ant-rate-text">{operation.tooltips[operation.value - 1]}</span>
                ) : (
                    ''
                )}
            </span>
        );
    }
});

export const RateFormAnt = observer(
    class RateFormAnt extends React.Component<BindAntProps<Rate> & Partial<FormItemProps>> {
        render() {
            const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
            if (invisible) {
                return null;
            }

            return (
                <FormItemAnt operation={operation} {...(this.props as any)}>
                    <RateAnt operation={operation} {...props} />
                </FormItemAnt>
            );
        }
    }
);
