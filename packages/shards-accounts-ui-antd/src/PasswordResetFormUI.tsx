import * as React from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { renderUIFragment, UIFragment } from '@moxb/react-html';

import './account-forms.css';

export interface PasswordResetFormUIProps {
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
     * Are we currently trying to execute the password reset?
     */
    resetPending: boolean;

    /**
     * Function for actually executing the password reset
     */
    onReset: (data: { password1: string; password2: string }) => void;

    /**
     * Link to display for logging in
     */
    loginLink?: JSX.Element;
}

const tailLayout = {
    wrapperCol: { offset: 8, span: 32 },
};

/**
 * A basic "password reset" form
 */
export function PasswordResetFormUI(props: PasswordResetFormUIProps) {
    const { error, resetPending, onReset, loginLink } = props;

    return (
        <Form labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} onFinish={onReset as any} className={'login-form'}>
            {renderUIFragment(props.splash)}
            <h2>Reset password on your account</h2>
            <Form.Item
                label="New password"
                name="password1"
                rules={[{ required: true, message: 'Please specify your new password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Password confirmation"
                name="password2"
                rules={[{ required: true, message: 'Please re-type your new password!' }]}
            >
                <Input.Password />
            </Form.Item>

            {!!error && <Alert type="error" message={error} closable={true} />}

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" disabled={resetPending}>
                    Reset password
                </Button>
                <span>{loginLink && <span> &nbsp; ...or {loginLink} </span>}</span>
            </Form.Item>
        </Form>
    );
}
