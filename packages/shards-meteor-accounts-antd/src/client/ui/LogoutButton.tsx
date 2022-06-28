import * as React from 'react';
import { Button } from 'antd';

function logOut() {
    Meteor.logout();
}

export const LogoutButton = () => {
    return <Button onClick={() => logOut()}>Log out</Button>;
};
