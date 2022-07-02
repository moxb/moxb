import { Button } from 'antd';
import * as React from 'react';
import { useAuthBackend } from './authContext';

export const LogoutButton = () => {
    const backend = useAuthBackend();
    return <Button onClick={() => backend.triggerLogout()}>Log out</Button>;
};
