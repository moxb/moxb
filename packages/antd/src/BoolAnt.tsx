import { observer } from 'mobx-react';
import * as React from 'react';
import { Checkbox, Form } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import { labelWithHelp, BindAntProps, parseProps, getErrorMessages } from './BindAnt';
import { Bool } from '@moxb/moxb';
import { FormItemProps } from 'antd/lib/form/FormItem';

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
                checked={operation.value}
                onChange={() => operation.toggle()}
                indeterminate={indeterminate}
                {...props}
            >
                {children}
                {labelWithHelp(label != null ? label : operation.label, operation.help)}
            </Checkbox>
        );
    }
}

@observer
export class BoolFormAnt extends React.Component<BindAntProps<Bool> & FormItemProps & CheckboxProps> {
    render() {
        const { operation, ...props } = parseProps(this.props, this.props.operation);
        return (
            <Form.Item
                required={operation.required}
                hasFeedback={operation.errors!.length > 0}
                validateStatus={operation.errors!.length > 0 ? 'error' : undefined}
                help={operation.errors!.length > 0 ? getErrorMessages(operation.errors!) : null}
                {...props as any}
            >
                <BoolAnt operation={this.props.operation} />
            </Form.Item>
        );
    }
}
