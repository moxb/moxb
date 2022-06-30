import * as React from 'react';
import { LogoutButtonUI } from '@moxb/shards-account-ui-antd/src';

export function userLogout() {
    Meteor.logout();
}

export const LogoutButton = () => <LogoutButtonUI onLogout={userLogout} />;
