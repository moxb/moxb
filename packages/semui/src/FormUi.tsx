import { Form as MoxForm, t } from '@moxb/moxb';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Form, FormProps, Message } from 'semantic-ui-react';
import { parseProps } from './BindUi';

export interface BindFormUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: MoxForm;
    hideErrors?: boolean;
}

export const FormUi = observer((props: FormProps & BindFormUiProps) => {
    const { operation, children, invisible, hideErrors, ...rest } = parseProps(props);
    if (invisible) {
        return null;
    }
    return (
        <Form onSubmit={operation.onSubmitForm} {...rest} error={operation.hasErrors}>
            {children}
            {!hideErrors && (
                <Message
                    attached="bottom"
                    onDismiss={operation.hasErrors ? operation.clearErrors : undefined}
                    hidden={!operation.hasErrors}
                    negative
                >
                    <Message.Header>
                        {t('FormUi.errors.header', 'Errors', { count: operation.allErrors.length })}
                    </Message.Header>
                    <Message.List items={operation.allErrors} />
                </Message>
            )}
        </Form>
    );
});
