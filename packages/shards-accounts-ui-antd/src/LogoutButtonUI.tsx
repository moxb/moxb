import * as React from 'react';
import { Button } from 'antd';

export interface LogoutButtonUIProps {
    /**
     * Function to call for logging out;
     */
    onLogout(): void;
}

export const LogoutButtonUI = (props: LogoutButtonUIProps) => <Button onClick={() => props.onLogout()}>Log out</Button>;
