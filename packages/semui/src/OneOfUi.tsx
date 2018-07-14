import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, FormFieldProps, FormRadioProps } from 'semantic-ui-react';
import { idToDomId } from '@moxb/moxb';
import { BindUiProps, parseProps } from './BindUi';
import { OneOf } from '@moxb/moxb';

@observer
export class OneOfUi extends React.Component<BindUiProps<OneOf> & FormRadioProps> {
    render() {
        const { operation, id, label, invisible, children, type, width, value, ...props } = parseProps(this.props);
        if (invisible) {
            return null;
        }
        return operation.choices.map(c => (
            <Form.Radio
                id={idToDomId(id + '-' + c.value)}
                onChange={() => operation.setValue(c.value)}
                key={c.value}
                checked={c.value === operation.value}
                label={c.label != null ? c.label : c.value}
                {...props}
                width={width as any}
                type={type as any}
            />
        ));
    }
}

@observer
export class OneOfSelectUi extends React.Component<BindUiProps<OneOf> & FormFieldProps> {
    render() {
        const { operation, id, invisible, type, width, children, onBlur, onClick, scrolling, ...props } = parseProps(
            this.props
        );
        if (invisible) {
            return null;
        }
        const options = operation.choices.map(c => ({ text: c.label, value: c.value }));
        return (
            <Form.Select
                id={id}
                onChange={(e, { value }) => operation.setValue(value as string)}
                options={options}
                defaultValue={operation.value}
                {...props}
                width={width as any}
                type={type as any}
            />
        );
    }
}
