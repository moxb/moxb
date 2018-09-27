import { Form, Alert } from 'antd';
import * as React from 'react';
import { observer } from 'mobx-react';
import { FormProps } from 'antd/lib/form/Form';
import { parseProps } from './BindAnt';
import { Form as MoxForm, t } from '@moxb/moxb';

export interface BindFormAntProps extends React.HTMLProps<HTMLFormElement> {
    operation: MoxForm;
}

@observer
export class FormAnt extends React.Component<FormProps & BindFormAntProps> {
    render() {
        const { operation, children, ...props } = parseProps(this.props, this.props.operation);
        return (
            <Form onSubmit={operation.onSubmitForm} {...props as any}>
                {children}
                {operation.hasErrors && (
                    <Alert
                        message={t('FormAnt.errors.header', 'Errors')}
                        description={operation.allErrors}
                        type="error"
                        closable
                        onClose={operation.clearErrors}
                    />
                )}
            </Form>
        );
    }
}
