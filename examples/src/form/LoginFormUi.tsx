import { ActionFormButtonUi, FormUi, TextUi } from '@moxb/semui';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import { Application } from '../app/Application';
import { NavigationUi } from '../common/NavigationUi';

export const LoginFormUi = inject('app')(
    observer(class LoginFormUi extends React.Component<{ app?: Application }> {
        render() {
            const application = this.props.app;
            return (
                <Container text>
                    <NavigationUi />
                    <p>
                        Test login is <strong>username:</strong> demo, <strong>password:</strong> demo <br />
                        Other inputs test the error validation.
                    </p>
                    <FormUi operation={application!.testForm}>
                        <TextUi operation={application!.formUserText} />
                        <TextUi operation={application!.formPasswordText} />
                        <ActionFormButtonUi type="primary" operation={application!.formSubmitButton} />
                    </FormUi>
                </Container>
            );
        }
    })
);
