import { t, Text } from '@moxb/moxb';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, FormInputProps, Input, Message, TextArea } from 'semantic-ui-react';
import { labelWithHelp, parseProps } from './BindUi';

export interface BindStringUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: Text;
    useDoubleClickToEdit?: boolean;
    help?: string;
    showErrors?: boolean;
}

@observer
export class TextUi extends React.Component<FormInputProps & BindStringUiProps> {
    // tslint:disable-next-line:cyclomatic-complexity
    render() {
        const { operation, id, type, width, value, label, size, invisible, hideErrors, ...props } = parseProps(
            this.props
        );
        if (invisible) {
            return null;
        }
        return (
            <Form.Field
                id={id}
                error={operation.hasErrors}
                width={width as any}
                size={size as any}
                required={operation.required}
            >
                <label htmlFor={id + '_in'}>
                    {labelWithHelp(label != null ? label : operation.label, operation.help)}
                </label>

                {operation.control === 'input' && (
                    <Input
                        id={id + '_in'}
                        type={type || operation.inputType || undefined}
                        placeholder={operation.placeholder}
                        value={operation.value || value || ''}
                        onChange={(e: any) => operation.setValue(e.target.value)}
                        onFocus={operation.onEnterField}
                        onBlur={operation.onExitField}
                        {...props as any}
                    />
                )}
                {operation.control === 'textarea' && (
                    <TextArea
                        id={id + '_in'}
                        type={type || operation.inputType || undefined}
                        placeholder={operation.placeholder}
                        value={operation.value || value || ''}
                        onChange={(e: any) => operation.setValue(e.target.value)}
                        onFocus={operation.onEnterField}
                        onBlur={operation.onExitField}
                        {...props as any}
                    />
                )}

                {!hideErrors && (
                    <Message
                        onDismiss={operation.hasErrors ? operation.clearErrors : undefined}
                        hidden={!operation.hasErrors}
                        negative
                    >
                        <Message.Header>
                            {t('FormUi.errors.header', 'Errors', { count: operation.errors!.length })}
                        </Message.Header>
                        <Message.List items={toJS(operation.errors!)} />
                    </Message>
                )}
            </Form.Field>
        );
    }
}
