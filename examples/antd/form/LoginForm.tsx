import { FormAnt, TextFormAnt, ActionButtonAnt } from '@moxb/antd';
import { Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Application } from '../../store/Application';

@inject('app')
@observer
export class LoginForm extends React.Component<{ app?: Application }> {
    render() {
        const application = this.props.app;
        return (
            <FormAnt operation={application!.testForm}>
                <TextFormAnt
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} /> as any}
                    operation={application!.formUserText}
                />
                <TextFormAnt
                    type="password"
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} /> as any}
                    operation={application!.formPasswordText}
                />
                <ActionButtonAnt htmlType="submit" type="primary" operation={application!.formSubmitButton} />
            </FormAnt>
        );
    }
}
