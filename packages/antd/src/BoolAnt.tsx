import { Bool } from '@moxb/moxb';
import { Checkbox, Switch } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import { SwitchSize } from 'antd/lib/switch';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, labelWithHelpIndicator, parseProps } from './BindAnt';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

@observer
export class BoolAnt extends React.Component<BindAntProps<Bool> & CheckboxProps> {
    render() {
        const { operation, invisible, children, label, reason, ...props } = parseProps(
            this.props,
            this.props.operation
        );
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
                    {...props}
                >
                    {children}
                    {labelWithHelpIndicator(label, operation.help)}
                </Checkbox>
            </span>
        );
    }
}

export interface AllowedSwitchProps {
    prefixCls?: string;
    size?: SwitchSize;
    className?: string;
    checkedChildren?: React.ReactNode;
    unCheckedChildren?: React.ReactNode;
    autoFocus?: boolean;
    style?: React.CSSProperties;
}

@observer
export class BoolSwitchAnt extends React.Component<BindAntProps<Bool> & AllowedSwitchProps> {
    render() {
        const { operation, invisible, children, label, reason, disabled, ...props } = parseProps(
            this.props,
            this.props.operation
        );
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
                        {...props}
                    />
                </span>
                &nbsp; &nbsp;
                <span onClick={() => operation.toggle()} className={labelClassName}>
                    {labelWithHelpIndicator(label, operation.help)}
                </span>
            </span>
        );
    }
}

@observer
export class BoolFormAnt extends React.Component<BindAntProps<Bool> & Partial<FormItemProps> & CheckboxProps> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <BoolAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}

@observer
export class BoolSwitchFormAnt extends React.Component<
    BindAntProps<Bool> & Partial<FormItemProps> & AllowedSwitchProps
> {
    render() {
        const { operation, invisible, ...props } = parsePropsForChild(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <FormItemAnt operation={operation} {...(this.props as any)}>
                <BoolSwitchAnt operation={operation} {...props} />
            </FormItemAnt>
        );
    }
}
