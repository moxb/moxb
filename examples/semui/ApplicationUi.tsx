import * as React from 'react';
import { ActionButtonUi, ActionUi, BoolUi } from '@moxb/semui';
import { inject, observer } from 'mobx-react';
import { Application } from './Application';

@inject('app')
@observer
export class ApplicationUi extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;

        return (<>
            <h1>Semantic UI Components</h1>
            <h3>ActionButton UI Component</h3>
            <ActionButtonUi color="blue" size="large" operation={application!.testAction} />

            <h3>Action UI Bindings</h3>
            <ActionUi color="blue" size="large" operation={application!.testAction} />
            <br/>

            <h3>Bool UI Bindings</h3>
            <BoolUi operation={application!.testBool} />
            {application!.showCheckbox &&
                <p><br/>Additional text is visible now!</p>
            }
        </>) ;
    }
}
