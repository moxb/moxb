import { FormAnt, TextFormAnt, ActionButtonAnt } from '@moxb/antd';
import { Icon, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Application } from '../app/Application';

@inject('app')
@observer
export class LoginFormAnt extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;
        return (
                    <Row>
                        <FormAnt operation={application!.testForm}>
                            <h3>Login Form</h3>
                            <p>
                                Test login is <strong>username:</strong> demo, <strong>password:</strong> demo <br />
                                Other inputs test the error validation.
                            </p>
                            <TextFormAnt
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} /> as any}
                                operation={application!.formUserText}
                            />
                            <TextFormAnt
                                type="password"
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} /> as any}
                                operation={application!.formPasswordText}
                            />
                            <ActionButtonAnt
                                htmlType="submit"
                                type="primary"
                                operation={application!.formSubmitButton}
                            />
                        </FormAnt>
                    </Row>
        );
    }
}
