import { Numeric, t } from '@moxb/moxb';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, FormInputProps, Input, Message } from 'semantic-ui-react';
import { labelWithHelp, parseProps } from './BindUi';

export interface BindNumericUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: Numeric;
    help?: string;
    showErrors?: boolean;
}

export const NumericUi = observer(
    class NumericUi extends React.Component<FormInputProps & BindNumericUiProps> {
        render() {
            const { operation, id, label, invisible, hideErrors, width, size, ...props } = parseProps(this.props);
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

                    <Input
                        id={id + '_in'}
                        type={operation.inputType || this.props.type || 'number'}
                        placeholder="Interval"
                        value={operation.value}
                        min={operation.min}
                        max={operation.max}
                        step={operation.step}
                        onChange={(e) => operation.setValue(parseInt((e.target as any).value))}
                        onFocus={operation.onEnterField}
                        onBlur={operation.onExitField}
                        {...(props as any)}
                    />

                    {!hideErrors && (
                        <Message
                            onDismiss={operation.hasErrors ? operation.clearErrors : undefined}
                            hidden={!operation.hasErrors}
                            negative
                        >
                            <Message.Header>
                                {t('NumericUi.errors.header', 'Errors', { count: operation.errors!.length })}
                            </Message.Header>
                            <Message.List items={toJS(operation.errors!)} />
                        </Message>
                    )}
                </Form.Field>
            );
        }
    }
);
