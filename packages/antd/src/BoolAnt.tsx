import { Bool } from '@moxb/moxb';
import { Checkbox, Switch } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import { SwitchProps } from 'antd/lib/switch';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntProps, labelWithHelp, parseProps } from './BindAnt';
import { FormItemAnt, parsePropsForChild } from './FormItemAnt';

@observer
export class BoolAnt extends React.Component<BindAntProps<Bool> & CheckboxProps> {
    render() {
        const { operation, invisible, children, label, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        // a null value renders the checkbox in intermediate state!
        const indeterminate = operation.value == null;
        return (
            <Checkbox
                data-testid={operation.id}
                checked={operation.value}
                onChange={() => operation.toggle()}
                indeterminate={indeterminate}
                {...props}
            >
                {children}
                {labelWithHelp(label, operation.help, operation.id)}
            </Checkbox>
        );
    }
}

@observer
export class BoolSwitchAnt extends React.Component<BindAntProps<Bool> & SwitchProps> {
    render() {
        const { operation, invisible, children, label, checkedChildren, unCheckedChildren, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }

        return (
            <Switch
                data-testid={operation.id}
                checked={operation.value}
                onChange={() => operation.toggle()}
                checkedChildren={checkedChildren}
                unCheckedChildren={unCheckedChildren}
                {...props}
            />
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
export class BoolSwitchFormAnt extends React.Component<BindAntProps<Bool> & Partial<FormItemProps> & SwitchProps> {
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
