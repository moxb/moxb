import * as React from 'react';
import { ActionButtonUi, ActionUi, BoolUi, ActionDropdownItemUi, ConfirmUi } from '@moxb/semui';
import { inject, observer } from 'mobx-react';
import { Application } from './Application';
import { Dropdown } from 'semantic-ui-react';

@inject('app')
@observer
export class ApplicationUi extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;

        return (<>
            <h1>Semantic UI Components</h1>
            <h3>ActionButtonUI Component</h3>
            <ActionButtonUi color="blue" size="large" operation={application!.testAction} />

            <h3>ActionUI Component</h3>
            <ActionUi color="red" operation={application!.testAction} />

            <h3>ActionDropdownItemUi Component</h3>
            <Dropdown item text="Test dropdown">
                <Dropdown.Menu>
                    <ActionDropdownItemUi operation={application!.testAction} />
                </Dropdown.Menu>
            </Dropdown>
            <br/>

            <h3>BoolUI Component</h3>
            <BoolUi operation={application!.testBool} />
            {application!.showCheckbox &&
                <p><br/>Additional text is visible now!</p>
            }<br/>

            <h3>ConfirmUI Component</h3>
            <ConfirmUi confirm={application!.testConfirm} />
            <ActionUi size="tiny" operation={application!.newConfirmAction()} />
        </>) ;
    }
}
