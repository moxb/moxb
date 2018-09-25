import { Form as MoxForm, t } from '@moxb/moxb';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, FormProps, Message } from 'semantic-ui-react';
import { parseProps } from './BindUi';

export interface BindFormUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: MoxForm;
}

@observer
export class FormUi extends React.Component<FormProps & BindFormUiProps> {
    render() {
        const { operation, children, ...props } = parseProps(this.props);
        return (
            <Form onSubmit={operation.onSubmitForm} {...props}>
                {children}
                <Message
                    onDismiss={operation.hasErrors ? operation.clearErrors : undefined}
                    hidden={!operation.hasErrors}
                    negative
                >
                    <Message.Header>
                        {t('FormUi.errors.header', 'Errors', { count: operation.errors.length })}
                    </Message.Header>
                    <Message.List items={operation.errors} />
                </Message>
            </Form>
        );
    }
}
