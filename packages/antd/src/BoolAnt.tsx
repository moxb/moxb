import { Checkbox, Switch } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import { SwitchSize } from 'antd/lib/switch';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { BindAntProps, labelWithHelpIndicator, parseProps } from './BindAnt';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';
import { Bool } from '@moxb/moxb';

export const BoolAnt = observer((props: BindAntProps<Bool> & CheckboxProps) => {
    const { operation, invisible, children, label, reason, ...rest } = parseProps(props, props.operation);
    if (invisible) {
        return null;
    }

    // a null value renders the checkbox in intermediate state!
    const indeterminate = operation.value == null;
    return (
        <span title={reason || operation.help}>
            <Checkbox
                data-testid={operation.id}
                checked={operation.value}
                onChange={() => operation.toggle()}
                indeterminate={indeterminate}
                {...rest}
            >
                {children}
                {labelWithHelpIndicator(label, operation.help)}
            </Checkbox>
        </span>
    );
});

export interface AllowedSwitchProps {
    prefixCls?: string;
    size?: SwitchSize;
    className?: string;
    checkedChildren?: React.ReactNode;
    unCheckedChildren?: React.ReactNode;
    autoFocus?: boolean;
    style?: React.CSSProperties;
}

export const BoolSwitchAnt = observer((props: BindAntProps<Bool> & AllowedSwitchProps) => {
    const { operation, invisible, children, label, reason, disabled, ...rest } = parseProps(props, props.operation);
    if (invisible) {
        return null;
    }
    const switchClassName = disabled ? 'ant-checkbox-disabled' : '';
    const labelClassName = disabled ? '' : 'ant-checkbox-wrapper';
    return (
        <span title={reason || operation.help}>
            <span className={switchClassName}>
                <Switch
                    disabled={disabled}
                    data-testid={operation.id}
                    checked={operation.value}
                    onChange={() => operation.toggle()}
                    {...rest}
                />
            </span>
            &nbsp; &nbsp;
            <span onClick={() => operation.toggle()} className={labelClassName}>
                {labelWithHelpIndicator(label, operation.help)}
            </span>
        </span>
    );
});

export const BoolFormAnt = observer((props: BindAntProps<Bool> & Partial<FormItemProps> & CheckboxProps) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <BoolAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});

export const BoolSwitchFormAnt = observer((props: BindAntProps<Bool> & Partial<FormItemProps> & AllowedSwitchProps) => {
    const { operation, invisible, ...rest } = parsePropsForChild(props, props.operation);
    if (invisible) {
        return null;
    }
    return (
        <FormItemAnt operation={operation} {...(props as any)}>
            <BoolSwitchAnt operation={operation} {...rest} />
        </FormItemAnt>
    );
});
