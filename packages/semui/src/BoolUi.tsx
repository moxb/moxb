import { Bool, t } from '@moxb/moxb';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Checkbox, Dropdown, DropdownProps, Form, FormCheckboxProps, Message } from 'semantic-ui-react';
import { BindUiProps, labelWithHelp, parseProps } from './BindUi';

export const BoolUi = observer((props: { operation: Bool } & FormCheckboxProps) => {
    const { operation, id, invisible, children, hideErrors, label, ...rest } = parseProps(props);
    if (invisible) {
        return null;
    }
    // a null value renders the checkbox in intermediate state!
    const indeterminate = operation.value == null;
    return (
        <Form.Field id={id} error={operation.hasErrors} required={operation.required}>
            <label htmlFor={id + '_in'}>{labelWithHelp(label != null ? label : operation.label, operation.help)}</label>

            <Checkbox
                id={id + '_in'}
                data-testid={id}
                type={operation.inputType || props.type || 'checkbox'}
                checked={operation.value}
                onChange={() => operation.toggle()}
                indeterminate={indeterminate}
                {...(rest as any)}
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
});

export const BoolDropdownItemUi = observer((props: BindUiProps<Bool> & DropdownProps) => {
    const { operation, id, label, invisible, children, ...rest } = parseProps(props);
    if (invisible || operation.invisible) {
        return null;
    }
    // color, size and width cause problems when in ...props
    return (
        <Dropdown.Item id={id} onClick={operation.toggle} {...(rest as any)}>
            {children || operation.labelToggle || label}
        </Dropdown.Item>
    );
});
