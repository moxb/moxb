import { UIFragment, UIFragmentSpec } from '@moxb/antd';
import { StateSpace } from '@moxb/moxb';
import * as React from 'react';
// @ts-ignore
import lockImgUrl from '../images/lock.jpg';
import { ApplicationAnt } from './app/ApplicationAnt';

import { LoginFormAnt } from './form/LoginFormAnt';
import { MemTableAnt } from './memtable/MemTableAnt';
import { MoreMenusAnt } from './menus/MoreMenusAnt';

export const mainMenu: StateSpace<UIFragment, UIFragmentSpec, {}> = [
    {
        root: true,
        label: 'All Components',
        fragment: {
            main: ApplicationAnt,
        },
    },
    {
        key: 'loginForm',
        // hidden: true,
        label: (
            <span>
                <img src={lockImgUrl} width="32" />
                Login Form
            </span>
        ),
        fragment: {
            main: LoginFormAnt,
            bottom: 'Special footer for login form',
        },
    },
    {
        key: 'memTable',
        label: 'Mem Table',
        fragment: {
            main: MemTableAnt,
        },
        tokenMapping: ['groupId', 'objectId'],
    },
    {
        key: 'moreMenus',
        label: 'More Menus',
        fragment: {
            main: MoreMenusAnt,
        },
    },
];

export const defaultContent = {
    main: <span>No such content</span>,
    bottom: 'Common footer text',
};
