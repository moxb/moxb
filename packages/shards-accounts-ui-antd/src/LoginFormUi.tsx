import * as React from 'react';
import { Alert, Button, Form, Input, Spin } from 'antd';
import { renderUIFragment, UIFragment } from '@moxb/react-html';

import './account-forms.css';

export interface LoginFormUIProps {
    /**
     * What should be shown above the login dialog?
     *
     * I.e. company logo, banner, text, etc.
     */
    splash?: UIFragment;

    /**
     * Error message to display
     */
    error?: string;

    /**
     * Are we currently trying to log in?
     */
    loginPending: boolean;

    /**
     * Method for actually logging in
     */
    onLogin: (data: { username: string; password: string }) => void;

    /**
     * The link to register a new account
     */
    registerLink?: JSX.Element;

    /**
     * Link for password reset
     */
    forgotPasswordLink?: JSX.Element;
}

const tailLayout = {
    wrapperCol: { offset: 8, span: 32 },
};

/**
 * A basic login form
 */
export function LoginFormUI(props: LoginFormUIProps) {
    const { error, loginPending, onLogin, registerLink, forgotPasswordLink } = props;

    return (
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onLogin} className={'login-form'}>
            {renderUIFragment(props.splash)}
            <h2>Sign in to your account</h2>
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your e-mail used for registration!', type: 'email' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            {!!error && <Alert type="error" message={error} closable={true} />}

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" disabled={loginPending}>
                    {loginPending && <Spin />}
                    Sign in
                </Button>
                <span>
                    {registerLink && <span> &nbsp; ...or {registerLink} </span>}
                    {forgotPasswordLink && <span> &nbsp; or {forgotPasswordLink}</span>}
                </span>
            </Form.Item>
        </Form>
    );
}
