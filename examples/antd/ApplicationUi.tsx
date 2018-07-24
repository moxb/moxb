import * as React from 'react';
import { ActionButtonUi } from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { Application } from './Application';
import { Row, Col } from 'antd';

@inject('app')
@observer
export class ApplicationUi extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;

        return (<Row><Col span={12}>
            <h1>Ant design Components</h1>
            <hr/>

            <h3>ActionButtonUI Component</h3>
            <ActionButtonUi type="primary" operation={application!.testAction} />

            <div id="spacer" style={{paddingBottom: '100px'}} />
        </Col></Row>) ;
    }
}
