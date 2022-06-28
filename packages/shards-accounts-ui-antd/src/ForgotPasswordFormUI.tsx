import * as React from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { renderUIFragment, UIFragment } from '@moxb/react-html';
import './login-form.css';

export interface ForgotPasswordFormUIProps {
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
     * Any other message to display
     */
    message?: string;

    /**
     * Are we currently trying to request the password reset?
     */
    resetPending: boolean;

    /**
     * Method for actually requesting a password reset
     */
    onReset: (data: { username: string }) => void;

    /**
     * The link to register a new account
     */
    registerLink?: JSX.Element;

    /**
     * Link to display for logging in
     */
    loginLink?: JSX.Element;
}

const tailLayout = {
    wrapperCol: { offset: 8, span: 32 },
};

/**
 * A basic "Forgot password" form
 *
 * ... for requesting a password reset
 */
export function ForgotPasswordFormUI(props: ForgotPasswordFormUIProps) {
    const { error, message, resetPending, onReset, registerLink, loginLink } = props;

    return (
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onReset} className={'login-form'}>
            {renderUIFragment(props.splash)}
            <h2>Recover forgotten password</h2>
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your e-mail used for registration!', type: 'email' }]}
            >
                <Input />
            </Form.Item>

            {!!error && <Alert type="error" message={error} closable={true} />}
            {!!message && <Alert type="success" message={message} closable={true} />}

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" disabled={resetPending}>
                    Reset password
                </Button>
                <span>
                    {loginLink && <span> &nbsp; ...or {loginLink} </span>}
                    {registerLink && <span> &nbsp; ...or {registerLink} </span>}
                </span>
            </Form.Item>
        </Form>
    );
}
