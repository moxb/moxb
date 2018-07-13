import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, FormFieldProps } from 'semantic-ui-react';
import { BindUiProps, parseProps } from '../bind/BindUi';
import { ManyOf } from './ManyOf';

@observer
export class ManyOfUi extends React.Component<BindUiProps<ManyOf> & FormFieldProps> {
    render() {
        const {
            operation,
            id,
            invisible,
            type,
            width,
            children,
            onBlur,
            onClick,
            scrolling,
            defaultValue,
            ...props
        } = parseProps(this.props);
        if (invisible || operation.invisible) {
            return null;
        }
        const options = operation.choices.map(c => ({ key: c.value, text: c.label, value: c.value }));
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);
        return (
            <Form.Dropdown
                id={id}
                onChange={(e, data) => operation.setValue(data.value as string[])}
                options={options}
                value={value}
                {...props}
                width={width as any}
                type={type as any}
            />
        );
    }
}
