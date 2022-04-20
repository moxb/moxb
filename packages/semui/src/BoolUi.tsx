import { Bool, t } from '@moxb/moxb';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Checkbox, Dropdown, DropdownProps, Form, FormCheckboxProps, Message } from 'semantic-ui-react';
import { BindUiProps, labelWithHelp, parseProps } from './BindUi';

export const BoolUi = observer(
    class BoolUi extends React.Component<{ operation: Bool } & FormCheckboxProps> {
        render() {
            const { operation, id, invisible, children, hideErrors, label, ...props } = parseProps(this.props);
            if (invisible) {
                return null;
            }
            // a null value renders the checkbox in intermediate state!
            const indeterminate = operation.value == null;
            return (
                <Form.Field id={id} error={operation.hasErrors} required={operation.required}>
                    <label htmlFor={id + '_in'}>
                        {labelWithHelp(label != null ? label : operation.label, operation.help)}
                    </label>

                    <Checkbox
                        id={id + '_in'}
                        data-testid={id}
                        type={operation.inputType || this.props.type || 'checkbox'}
                        checked={operation.value}
                        onChange={() => operation.toggle()}
                        indeterminate={indeterminate}
                        {...(props as any)}
                    />
                    {children}

                    {!hideErrors && (
                        <Message
                            onDismiss={operation.hasErrors ? operation.clearErrors : undefined}
                            hidden={!operation.hasErrors}
                            negative
                        >
                            <Message.Header>
                                {t('BoolUi.errors.header', 'Errors', { count: operation.errors!.length })}
                            </Message.Header>
                            <Message.List items={toJS(operation.errors!)} />
                        </Message>
                    )}
                </Form.Field>
            );
        }
    }
);

export const BoolDropdownItemUi = observer(
    class BoolDropdownItemUi extends React.Component<BindUiProps<Bool> & DropdownProps> {
        render() {
            const { operation, id, label, invisible, children, ...props } = parseProps(this.props);
            if (invisible || operation.invisible) {
                return null;
            }
            // color, size and width cause problems when in ...props
            return (
                <Dropdown.Item id={id} onClick={operation.toggle} {...(props as any)}>
                    {children || operation.labelToggle || label}
                </Dropdown.Item>
            );
        }
    }
);
