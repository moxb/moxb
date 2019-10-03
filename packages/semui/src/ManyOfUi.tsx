import { ManyOf, t } from '@moxb/moxb';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Dropdown, Form, FormFieldProps, Message } from 'semantic-ui-react';
import { BindUiProps, labelWithHelp, parseProps } from './BindUi';

@observer
export class ManyOfUi extends React.Component<BindUiProps<ManyOf> & FormFieldProps> {
    render() {
        const { operation, id, invisible, type, width, hideErrors, label, error, ...props } = parseProps(this.props);
        if (invisible || operation.invisible) {
            return null;
        }
        const options = operation.choices.map(c => ({ key: c.value, text: c.label, value: c.value }));
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);
        return (
            <Form.Field id={id} error={operation.hasErrors} required={operation.required}>
                <label htmlFor={id + '_in'}>
                    {labelWithHelp(label != null ? label : operation.label, operation.help)}
                </label>

                <Dropdown
                    id={id}
                    onChange={(_e, data) => operation.setValue(data.value as string[])}
                    options={options}
                    value={value}
                    error={!!error}
                    {...props}
                    width={width as any}
                    type={type as any}
                />

                {!hideErrors && (
                    <Message
                        onDismiss={operation.hasErrors ? operation.clearErrors : undefined}
                        hidden={!operation.hasErrors}
                        negative
                    >
                        <Message.Header>
                            {t('ManyOfUi.errors.header', 'Errors', { count: operation.errors!.length })}
                        </Message.Header>
                        <Message.List items={toJS(operation.errors!)} />
                    </Message>
                )}
            </Form.Field>
        );
    }
}
