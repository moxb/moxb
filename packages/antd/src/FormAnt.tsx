import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Form } from 'antd';
import { t } from '@moxb/util';
import { Form as MoxForm } from '@moxb/moxb';

import { FormProps } from 'antd/lib/form/Form';

import { parseProps } from './BindAnt';

export interface BindFormAntProps extends React.HTMLProps<HTMLFormElement> {
    operation: MoxForm;
    hideErrors?: boolean;
}

export const FormAnt = observer((props: FormProps & BindFormAntProps) => {
    const { operation, children, invisible, hideErrors, ...rest } = parseProps(props, props.operation);
    if (invisible) {
        return null;
    }

    return (
        <Form data-testid={operation.id} onFinish={operation.onSubmitForm} {...(rest as any)}>
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
});
