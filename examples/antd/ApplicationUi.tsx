import * as React from 'react';
import { ActionButtonUi, BoolUi, ConfirmUi } from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { Application } from './Application';
import { Row, Col } from 'antd';

@inject('app')
@observer
export class ApplicationUi extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;

        return (
            <Row>
                <Col span={12}>
                    <h1>Ant design Components</h1>
                    <hr />

                    <h3>ActionButtonUI Component</h3>
                    <ActionButtonUi type="primary" operation={application!.testAction} />
                    <br />
                    <br />

                    <h3>BoolUI Component</h3>
                    <BoolUi operation={application!.testBool} />
                    {application!.showCheckbox && (
                        <p>
                            <br />Additional text is visible now!
                        </p>
                    )}
                    <br />

                    <h3>ConfirmUI Component</h3>
                    <ConfirmUi confirm={application!.testConfirm} />
                    <ActionButtonUi operation={application!.newConfirmAction()} />
                    <br />

                    <div id="spacer" style={{ paddingBottom: '100px' }} />
                </Col>
            </Row>
        );
    }
}
