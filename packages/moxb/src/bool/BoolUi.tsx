import { observer } from 'mobx-react';
import * as React from 'react';
import { Dropdown, DropdownProps, Form, FormCheckboxProps } from 'semantic-ui-react';
import { BindUiProps, labelWithHelp, parseProps } from '../bind/BindUi';
import { Bool } from './Bool';

@observer
export class BoolUi extends React.Component<{ operation: Bool } & FormCheckboxProps> {
    render() {
        const { operation, id, invisible, children, label, ...props } = parseProps(this.props);
        if (invisible) {
            return null;
        }
        // a null value renders the checkbox in intermediate state!
        const indeterminate = operation.value == null;
        return (
            <Form.Checkbox
                id={id}
                error={operation.error != null}
                checked={operation.value}
                onChange={() => operation.toggle()}
                indeterminate={indeterminate}
                label={labelWithHelp(label != null ? label : operation.label, operation.help)}
                {...props}
            >
                {children}
            </Form.Checkbox>
        );
    }
}

@observer
export class BoolDropdownItemUi extends React.Component<BindUiProps<Bool> & DropdownProps> {
    render() {
        const { operation, id, label, invisible, children, ...props } = parseProps(this.props);
        if (invisible || operation.invisible) {
            return null;
        }
        // color, size and width cause problems when in ...props
        return (
            <Dropdown.Item id={id} onClick={operation.toggle} {...props as any}>
                {children || operation.labelToggle || label}
            </Dropdown.Item>
        );
    }
}
