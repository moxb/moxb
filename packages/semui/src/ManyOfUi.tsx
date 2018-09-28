import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, FormFieldProps, Message, Dropdown } from 'semantic-ui-react';
import { BindUiProps, parseProps, labelWithHelp } from './BindUi';
import { ManyOf, t } from '@moxb/moxb';

@observer
export class ManyOfUi extends React.Component<BindUiProps<ManyOf> & FormFieldProps> {
    render() {
        const { operation, id, invisible, type, width, hideErrors, label, ...props } = parseProps(this.props);
        if (invisible || operation.invisible) {
            return null;
        }
        const options = operation.choices.map(c => ({ key: c.value, text: c.label, value: c.value }));
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);
        return (
            <Form.Field id={id} error={operation.errors!.length > 0} required={operation.required}>
                <label htmlFor={id + '_in'}>
                    {labelWithHelp(label != null ? label : operation.label, operation.help)}
                </label>

                <Dropdown
                    id={id}
                    onChange={(e, data) => operation.setValue(data.value as string[])}
                    options={options}
                    value={value}
                    {...props}
                    width={width as any}
                    type={type as any}
                />

                {!hideErrors && (
                    <Message
                        onDismiss={operation.errors!.length > 0 ? operation.clearErrors : undefined}
                        hidden={!(operation.errors!.length > 0)}
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
