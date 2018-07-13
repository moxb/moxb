import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, FormInputProps } from 'semantic-ui-react';
import { BindUiProps, parseProps } from '../bind/BindUi';
import { Numeric } from './Numeric';

@observer
export class NumericUi extends React.Component<BindUiProps<Numeric> & FormInputProps> {
    render() {
        const { operation, id, label, invisible, children, width, size, ...props } = parseProps(this.props);
        if (invisible) {
            return null;
        }
        return (
            <Form.Input
                id={id}
                type={operation.inputType || this.props.type || 'number'}
                error={operation.error != null}
                step={operation.step}
                min={operation.min}
                max={operation.max}
                value={operation.value}
                label={children || label}
                size={size as any}
                width={width as any}
                placeholder="Interval"
                onChange={e => operation.setValue(parseInt((e.target as any).value))}
                {...props}
            />
        );
    }
}
