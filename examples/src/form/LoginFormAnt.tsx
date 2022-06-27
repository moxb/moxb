import * as React from 'react';
import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import { Row } from 'antd';
import UserOutlined from '@ant-design/icons/UserOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';

import { ActionButtonAnt, FormAnt, TextFormAnt } from '@moxb/antd';

import { NavigableUIContent } from '@moxb/stellar-router-react';

import { useStore } from '../store/Store';

export const LoginFormAnt = observer((props: NavigableUIContent) => {
    const { app } = useStore();

    useEffect(() => {
        const { navControl } = props;
        navControl.registerStateHooks({
            getLeaveQuestion: () =>
                app!.formPasswordText.value
                    ? 'Really leave the login form? You have already entered your super secure password!'
                    : null,
        });
    }, []);

    return (
        <Row>
            <FormAnt operation={app!.testForm}>
                <h3>Login Form</h3>
                <p>
                    Test login is <strong>username:</strong> demo, <strong>password:</strong> demo <br />
                    Other inputs test the error validation.
                </p>
                <TextFormAnt
                    prefix={(<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />) as any}
                    operation={app!.formUserText}
                />
                <TextFormAnt
                    type="password"
                    prefix={(<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />) as any}
                    operation={app!.formPasswordText}
                />
                <ActionButtonAnt htmlType="submit" type="primary" operation={app!.formSubmitButton} />
            </FormAnt>
        </Row>
    );
});
