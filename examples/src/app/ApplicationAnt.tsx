import {
    ActionButtonAnt,
    BoolAnt,
    ConfirmAnt,
    ModalAnt,
    TextFormAnt,
    TextAnt,
    NumericFormAnt,
    ManyOfAnt,
    ManyOfCheckboxAnt,
    OneOfAnt,
    OneOfSelectAnt,
    DatePickerAnt,
    TimePickerAnt,
    TableAnt,
} from '@moxb/antd';
import { Col, Form, Layout, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { toJSON } from '@moxb/moxb';
import { LoginFormAnt } from '../form/LoginFormAnt';
import { MemTableAnt } from '../memtable/MemTableAnt';
import { Application } from './Application';

// helper function to print recursive mobx trees
(window as any).js = function(value: any, ignore = /\b(store|storage)\b/) {
    return toJSON(value, ignore);
};

@inject('app')
@observer
export class ApplicationAnt extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app!;
        console.log('app', application.testAction);
        return (
            <Layout>
                <Layout.Content>
                    <Row>
                        <Col span={16}>
                            <section
                                style={{
                                    border: '1px solid #ebedf0',
                                    padding: '42px 24px 50px',
                                    color: 'rgba(0,0,0,.65)',
                                }}
                            >
                                <Form>
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
                                    <ConfirmAnt operation={application.testConfirm} />
                                    <ActionButtonAnt operation={application.newConfirmAction()} />
                                    <br />
                                    <br />
                                    <h3>ModalAnt Component</h3>
                                    <ActionButtonAnt color="green" operation={application.newModalAction()} />
                                    <ModalAnt operation={application.testModal}>
                                        <TextFormAnt operation={application.testText} />
                                    </ModalAnt>
                                    <br />
                                    <br />
                                    <h3>TextAnt - Input Component</h3>
                                    <TextAnt
                                        id={application.testTextfield + '-1'}
                                        operation={application.testTextfield}
                                    />
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
                                    <NumericFormAnt operation={application.testNumeric} />
                                    <br />
                                    <br />
                                    <h3>ManyOfAnt Component</h3>
                                    <ManyOfAnt style={{ width: '200px' }} operation={application.testManyOf} />
                                    <br />
                                    <br />
                                    <h3>ManyOfAnt Component - multiple selection</h3>
                                    <ManyOfAnt
                                        style={{ width: '200px' }}
                                        mode="multiple"
                                        operation={application.testManyOf}
                                    />
                                    <br />
                                    <br />
                                    <h3>ManyOfCheckboxAnt Component - multiple selection with checkboxes</h3>
                                    <ManyOfCheckboxAnt style={{ width: '200px' }} operation={application.testManyOf} />
                                    <br />
                                    <br />
                                    <h3>OneOf - RadioBox Component</h3>
                                    <OneOfAnt operation={application.testOfOne} />
                                    <br />
                                    <br /> <h3>OneOf - Select Component</h3>
                                    <OneOfSelectAnt operation={application.testOfOne} />
                                    <br />
                                    <br />
                                    <h3>DatePicker Component</h3>
                                    <DatePickerAnt operation={application.testDate} />
                                    <br />
                                    <br />
                                    <h3>TimePicker Component</h3>
                                    <TimePickerAnt operation={application.testTime} />
                                    <br />
                                    <br />
                                    <hr />
                                    <br />
                                    <section>
                                        <h3>Login Form</h3>
                                        <p>
                                            Test login is <strong>username:</strong> demo, <strong>password:</strong>{' '}
                                            demo <br />
                                            Other inputs test the error validation.
                                        </p>
                                        <LoginFormAnt />
                                    </section>
                                    <br />
                                    <hr />
                                    <br />
                                    <h3>Table Component</h3>
                                    <TableAnt table={application.testTable} />
                                    <br />
                                    <h3>Table Component</h3>
                                    <MemTableAnt />
                                    <br />
                                    <div id="spacer" style={{ paddingBottom: '100px' }} />
                                </Form>
                            </section>
                        </Col>
                    </Row>
                </Layout.Content>
            </Layout>
        );
    }
}
