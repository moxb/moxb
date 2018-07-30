import { observer } from 'mobx-react';
import * as React from 'react';
import { Checkbox } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import { BindUiProps, parseProps } from './BindUi';
import { Bool } from '@moxb/moxb';

@observer
export class BoolUi extends React.Component<BindUiProps<Bool> & CheckboxProps> {
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
                {label != null ? label : operation.label}
            </Checkbox>
        );
    }
}
