import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormUi, TextUi, ActionFormButtonUi } from '@moxb/semui';
import { Application } from '../../store/Application';

@inject('app')
@observer
export class LoginFormUi extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;
        return (
            <FormUi operation={application!.testForm}>
                <TextUi required operation={application!.formUserText} />
                <TextUi operation={application!.formPasswordText} />
                <ActionFormButtonUi type="primary" operation={application!.formSubmitButton} />
            </FormUi>
        );
    }
}
