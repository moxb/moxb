import { Form as MoxForm, t } from '@moxb/moxb';
import { Alert, Form } from 'antd';
import { FormProps } from 'antd/lib/form/Form';
import { observer } from 'mobx-react';
import * as React from 'react';
import { parseProps } from './BindAnt';

export interface BindFormAntProps extends React.HTMLProps<HTMLFormElement> {
    operation: MoxForm;
    hideErrors?: boolean;
}

@observer
export class FormAnt extends React.Component<FormProps & BindFormAntProps> {
    render() {
        const { operation, children, invisible, hideErrors, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }

        return (
            <Form data-testid={operation.id} onFinish={operation.onSubmitForm} {...(props as any)}>
                {children}
                {!hideErrors && operation.hasErrors && (
                    <Alert
                        message={t('FormAnt.errors.header', 'Errors')}
                        description={operation.allErrors.join(', ')}
                        type="error"
                        closable
                        onClose={operation.clearErrors}
                    />
                )}
            </Form>
        );
    }
}
