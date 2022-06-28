import * as React from 'react';
import { Alert, Button, Form, Input, Spin } from 'antd';
import { renderUIFragment, UIFragment } from '@moxb/react-html';

import './account-forms.css';

export interface RegistrationFormUIProps {
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
     * Are we currently trying to register a user?
     */
    registrationPending: boolean;

    /**
     * Function to call for registering a user
     */
    onRegister: (data: { email: string; password1: string; password2: string }) => void;

    /**
     * Login link to display
     */
    loginLink?: JSX.Element;

    /**
     * Password reset link to display
     */
    forgotPasswordLink?: JSX.Element;
}

const tailLayout = {
    wrapperCol: { offset: 8, span: 32 },
};

/**
 * A basic user registration form
 */
export function RegistrationFormUI(props: RegistrationFormUIProps) {
    const { error, registrationPending, onRegister, loginLink, forgotPasswordLink } = props;

    return (
        <Form labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} onFinish={onRegister} className={'login-form'}>
            {renderUIFragment(props.splash)}
            <h2>Create a new account</h2>
            <Form.Item
                label="E-mail"
                name="email"
                rules={[{ required: true, message: 'Please enter the e-mail address you want to use!', type: 'email' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password1"
                rules={[{ required: true, message: 'Please specify your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Password confirmation"
                name="password2"
                rules={[{ required: true, message: 'Please re-type your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            {!!error && <Alert type="error" message={error} closable={true} />}

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" disabled={registrationPending}>
                    {registrationPending && <Spin />}
                    Sign up
                </Button>
                <span>
                    {loginLink && <span> &nbsp; ...or {loginLink} </span>}
                    {forgotPasswordLink && <span> &nbsp; or {forgotPasswordLink}</span>}
                </span>
            </Form.Item>
        </Form>
    );
}
