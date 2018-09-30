import { Form, Alert } from 'antd';
import * as React from 'react';
import { observer } from 'mobx-react';
import { FormProps } from 'antd/lib/form/Form';
import { parseProps } from './BindAnt';
import { Form as MoxForm, t } from '@moxb/moxb';

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
            <Form onSubmit={operation.onSubmitForm} {...props as any}>
                {children}
                {!hideErrors &&
                    operation.hasErrors && (
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
