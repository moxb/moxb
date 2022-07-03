import { Button } from 'antd';
import * as React from 'react';
import { useAuthenticationLogic } from './authContext';

export const LogoutButton = () => {
    const auth = useAuthenticationLogic();
    return <Button onClick={() => auth.triggerLogout()}>Log out</Button>;
};
