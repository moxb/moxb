import * as React from 'react';
import {
    ActionButtonAnt,
    BoolAnt,
    ConfirmAnt,
    ModalAnt,
    TextFormAnt,
    TextAnt,
    ManyOfAnt,
    ManyOfCheckboxAnt,
    BoolFormAnt,
    NumericAnt,
    OneOfAnt,
    TableAnt,
    DatePickerAnt,
} from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { Application } from '../store/Application';
import { Row, Col, Form, Icon } from 'antd';
import { MemTableAnt } from './memtable/MemTableAnt';

@inject('app')
@observer
export class ApplicationAnt extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app!;
        console.log('application.testDate', application.testDate);
        return (
            <Row>
                <Col span={16}>
                    <h1>Ant design Components</h1>
                    <hr />

                    <h3>ActionButtonUI Component</h3>
                    <ActionButtonAnt type="primary" operation={application.testAction} />
                    <br />
                    <br />

                    <h3>BoolUI Component</h3>
                    <BoolAnt operation={application.testBool} />
                    {application.showCheckbox && (
                        <p>
                            <br />
                            Additional text is visible now!
                        </p>
                    )}
                    <br />

                    <h3>ConfirmUI Component</h3>
                    <ConfirmAnt confirm={application.testConfirm} />
                    <ActionButtonAnt operation={application.newConfirmAction()} />
                    <br />
                    <br />

                    <h3>ModalAnt Component</h3>
                    <ActionButtonAnt color="green" operation={application.newModalAction()} />
                    <ModalAnt modal={application.testModal}>
                        <TextFormAnt operation={application.testText} />
                    </ModalAnt>
                    <br />
                    <br />

                    <h3>TextAnt - Input Component</h3>
                    <TextAnt id={application.testTextfield + '-1'} operation={application.testTextfield} />
                    <br />
                    <br />

                    <h3>TextAnt - Password Input Component</h3>
                    <TextAnt type="password" operation={application.testTextfield} />
                    <br />
                    <br />

                    <h3>TextAnt - Textarea Component</h3>
                    <TextAnt operation={application.testTextarea} />
                    <br />
                    <br />

                    <h3>NumericAnt Component</h3>
                    <NumericAnt required operation={application.testNumeric} />
                    <br />
                    <br />

                    <h3>ManyOfAnt Component</h3>
                    <ManyOfAnt style={{ width: '200px' }} operation={application.testManyOf} />
                    <br />
                    <br />

                    <h3>ManyOfAnt Component - multiple selection</h3>
                    <ManyOfAnt style={{ width: '200px' }} mode="multiple" operation={application.testManyOf} />
                    <br />
                    <br />

                    <h3>ManyOfCheckboxAnt Component - multiple selection with checkboxes</h3>
                    <ManyOfCheckboxAnt style={{ width: '200px' }} operation={application.testManyOf} />
                    <br />
                    <br />

                    <h3>OneOf - RadioBox Component</h3>
                    <OneOfAnt operation={application.testOfOne} />
                    <br />
                    <br />

                    <h3>DatePicker Component</h3>
                    <DatePickerAnt operation={application.testDate} />
                    <br />
                    <br />

                    <hr />
                    <br />
                    <section
                        style={{ border: '1px solid #ebedf0', padding: '42px 24px 50px', color: 'rgba(0,0,0,.65)' }}
                    >
                        <h3>Login Form</h3>
                        <Form onSubmit={() => {}} className="login-form">
                            <TextFormAnt
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} /> as any}
                                operation={application.formUserText}
                            />
                            <TextFormAnt
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} /> as any}
                                operation={application.formPasswordText}
                            />
                            <BoolFormAnt operation={application.formRememberBool} />
                            <ActionButtonAnt type="primary" operation={application.formSubmitButton} />
                        </Form>
                    </section>
                    <br />
                    <br />

                    <h3>Table Component</h3>
                    <TableAnt table={application.testTable} />
                    <br />

                    <h3>Table Component</h3>
                    <MemTableAnt />
                    <br />
                    <div id="spacer" style={{ paddingBottom: '100px' }} />
                </Col>
            </Row>
        );
    }
}
