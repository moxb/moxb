import { ActionFormButtonUi, FormUi, TextUi } from '@moxb/semui';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import { NavigationUi } from '../common/NavigationUi';
import { useStore } from '../store/Store';

export const LoginFormUi = observer(() => {
    const { app: application } = useStore();
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
                <ActionFormButtonUi type="button" operation={application!.formSubmitButton} />
            </FormUi>
        </Container>
    );
});
