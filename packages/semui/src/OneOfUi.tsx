import { idToDomId, OneOf, t } from '@moxb/moxb';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Checkbox, Form, FormFieldProps, FormRadioProps, Message, Select } from 'semantic-ui-react';
import { BindUiProps, labelWithHelp, parseProps } from './BindUi';

export const OneOfUi = observer((props: BindUiProps<OneOf> & FormRadioProps) => {
    const { operation, id, label, invisible, hideErrors, type, width, ...rest } = parseProps(props);
    if (invisible) {
        return null;
    }
    return (
        <Form.Field id={id} error={operation.hasErrors} required={operation.required}>
            <label htmlFor={id + '_in'}>{labelWithHelp(label != null ? label : operation.label, operation.help)}</label>

            {operation.choices.map((c) => (
                <Checkbox
                    radio
                    id={idToDomId(id + '-' + c.value)}
                    onChange={() => operation.setValue(c.value)}
                    key={c.value}
                    name="checkboxRadioGroup"
                    checked={c.value === operation.value}
                    label={c.label != null ? c.label : c.value}
                    {...rest}
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
});

export const OneOfSelectUi = observer((props: BindUiProps<OneOf> & FormFieldProps) => {
    const { operation, id, invisible, hideErrors, type, width, label, required, ...rest } = parseProps(props);
    if (invisible) {
        return null;
    }
    const options = operation.choices.map((c) => ({ text: c.label, value: c.value }));
    return (
        <Form.Field id={id} error={operation.hasErrors} required={required}>
            <label htmlFor={id + '_in'}>{labelWithHelp(label != null ? label : operation.label, operation.help)}</label>

            <Select
                id={id + '_in'}
                onChange={(_e, { value }) => operation.setValue(value as string)}
                options={options}
                defaultValue={operation.value}
                width={width as any}
                type={type as any}
                {...(rest as any)}
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
});
