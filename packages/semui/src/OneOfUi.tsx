import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, FormFieldProps, FormRadioProps, Message, Select, Checkbox } from 'semantic-ui-react';
import { idToDomId } from '@moxb/moxb';
import { BindUiProps, parseProps, labelWithHelp } from './BindUi';
import { OneOf, t } from '@moxb/moxb';

@observer
export class OneOfUi extends React.Component<BindUiProps<OneOf> & FormRadioProps> {
    render() {
        const { operation, id, label, invisible, hideErrors, type, width, ...props } = parseProps(this.props);
        if (invisible) {
            return null;
        }
        return (
            <Form.Field id={id} error={operation.hasErrors} required={operation.required}>
                <label htmlFor={id + '_in'}>
                    {labelWithHelp(label != null ? label : operation.label, operation.help)}
                </label>

                {operation.choices.map(c => (
                    <Checkbox
                        radio
                        id={idToDomId(id + '-' + c.value)}
                        onChange={() => operation.setValue(c.value)}
                        key={c.value}
                        name="checkboxRadioGroup"
                        checked={c.value === operation.value}
                        label={c.label != null ? c.label : c.value}
                        {...props}
                        width={width as any}
                        type={type as any}
                    />
                ))}

                {!hideErrors && (
                    <Message
                        onDismiss={operation.hasErrors ? operation.clearErrors : undefined}
                        hidden={!operation.hasErrors}
                        negative
                    >
                        <Message.Header>
                            {t('OneOfSelectUi.errors.header', 'Errors', { count: operation.errors!.length })}
                        </Message.Header>
                        <Message.List items={toJS(operation.errors!)} />
                    </Message>
                )}
            </Form.Field>
        );
    }
}

@observer
export class OneOfSelectUi extends React.Component<BindUiProps<OneOf> & FormFieldProps> {
    render() {
        const { operation, id, invisible, hideErrors, type, width, label, required, ...props } = parseProps(this.props);
        if (invisible) {
            return null;
        }
        const options = operation.choices.map(c => ({ text: c.label, value: c.value }));
        return (
            <Form.Field id={id} error={operation.hasErrors} required={required}>
                <label htmlFor={id + '_in'}>
                    {labelWithHelp(label != null ? label : operation.label, operation.help)}
                </label>

                <Select
                    id={id + '_in'}
                    onChange={(_e, { value }) => operation.setValue(value as string)}
                    options={options}
                    defaultValue={operation.value}
                    width={width as any}
                    type={type as any}
                    {...props as any}
                />

                {!hideErrors && (
                    <Message
                        onDismiss={operation.hasErrors ? operation.clearErrors : undefined}
                        hidden={!operation.hasErrors}
                        negative
                    >
                        <Message.Header>
                            {t('OneOfSelectUi.errors.header', 'Errors', { count: operation.errors!.length })}
                        </Message.Header>
                        <Message.List items={toJS(operation.errors!)} />
                    </Message>
                )}
            </Form.Field>
        );
    }
}
