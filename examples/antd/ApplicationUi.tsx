import * as React from 'react';
import {
    ActionButtonUi,
    BoolUi,
    ConfirmUi,
    ModalUi,
    TextFormUi,
    TextUi,
    ManyOfUi,
    BoolFormUi,
    NumericUi,
} from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { Application } from './Application';
import { Row, Col, Form, Icon } from 'antd';

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
                    <br />

                    <h3>ModalUi Component</h3>
                    <ActionButtonUi color="green" operation={application!.newModalAction()} />
                    <ModalUi modal={application!.testModal}>
                        <TextFormUi operation={application!.testText} />
                    </ModalUi>
                    <br />
                    <br />

                    <h3>TextUi - Input Component</h3>
                    <TextUi operation={application!.testTextfield} />
                    <br />
                    <br />
                    <h3>TextUi - Textarea Component</h3>
                    <TextUi operation={application!.testTextarea} />
                    <br />
                    <br />

                    <h3>NumericUi Component</h3>
                    <NumericUi required operation={application!.testNumeric} />
                    <br />
                    <br />

                    <h3>ManyOfUi Component</h3>
                    <ManyOfUi style={{ width: '200px' }} operation={application!.testManyOf} />
                    <br />
                    <br />

                    <h3>ManyOfUi Component - multiple selection</h3>
                    <ManyOfUi style={{ width: '200px' }} mode="multiple" operation={application!.testManyOf} />
                    <br />
                    <br />

                    <hr />
                    <br />
                    <section
                        style={{ border: '1px solid #ebedf0', padding: '42px 24px 50px', color: 'rgba(0,0,0,.65)' }}
                    >
                        <h3>Login Form</h3>
                        <Form onSubmit={() => {}} className="login-form">
                            <TextFormUi
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} /> as any}
                                operation={application!.formUserText}
                            />
                            <TextFormUi
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} /> as any}
                                operation={application!.formPasswordText}
                            />
                            <BoolFormUi operation={application!.formRememberBool} />
                            <ActionButtonUi type="primary" operation={application!.formSubmitButton} />
                        </Form>
                    </section>

                    <div id="spacer" style={{ paddingBottom: '100px' }} />
                </Col>
            </Row>
        );
    }
}
