import { observer } from 'mobx-react';
import * as React from 'react';
import { Checkbox, Form } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import { labelWithHelp, BindAntProps, parseProps } from './BindAnt';
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
        return (
            <Form.Item>
                <BoolAnt operation={this.props.operation} />
            </Form.Item>
        );
    }
}
