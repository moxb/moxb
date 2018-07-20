import * as React from 'react';
import { ActionButtonUi } from '@moxb/semui';
import { inject, observer } from 'mobx-react';
import { Application } from './Application';

@inject('app')
@observer
export class ApplicationUi extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;

        return (<>
            <h3>Action UI Bindings</h3>
            <ActionButtonUi color="green" fluid size="large" operation={application!.bindAction} />
            <hr/>
        </>) ;
    }
}
