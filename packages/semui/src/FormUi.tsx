import { Form as MoxForm, t } from '@moxb/moxb';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, FormProps, Message } from 'semantic-ui-react';
import { parseProps } from './BindUi';

export interface BindFormUiProps extends React.HTMLProps<HTMLFormElement> {
    operation: MoxForm;
    hideErrors?: boolean;
}

@observer
export class FormUi extends React.Component<FormProps & BindFormUiProps> {
    render() {
        const { operation, children, invisible, hideErrors, ...props } = parseProps(this.props);
        if (invisible) {
            return null;
        }
        return (
            <Form onSubmit={operation.onSubmitForm} {...props} error={operation.hasErrors}>
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
    }
}
