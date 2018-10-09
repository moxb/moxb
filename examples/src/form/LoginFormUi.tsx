import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormUi, TextUi, ActionFormButtonUi } from '@moxb/semui';
import { Container } from 'semantic-ui-react';
import { Application } from '../app/Application';
import { NavigationUi } from '../common/NavigationUi';

@inject('app')
@observer
export class LoginFormUi extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;
        return (
            <Container text>
                <NavigationUi />
                <FormUi operation={application!.testForm}>
                    <TextUi operation={application!.formUserText} />
                    <TextUi operation={application!.formPasswordText} />
                    <ActionFormButtonUi type="primary" operation={application!.formSubmitButton} />
                </FormUi>
            </Container>
        );
    }
}
