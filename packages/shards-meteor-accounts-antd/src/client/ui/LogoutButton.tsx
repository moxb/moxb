import * as React from 'react';
import { Button } from 'antd';

export function userLogout() {
    Meteor.logout();
}

export const LogoutButton = () => {
    return <Button onClick={userLogout}>Log out</Button>;
};
