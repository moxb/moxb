import * as React from 'react';

import { LoginFormAnt, PATH as loginPath } from './form/LoginFormAnt';
import { MemTableAnt, PATH as memTablePath } from './memtable/MemTableAnt';
import { ApplicationAnt } from './app/ApplicationAnt';
import { MoreMenusAnt, PATH as moreMenuPath } from './menus/MoreMenusAnt';

import lockImgUrl from '../images/lock.jpg';

import { StateSpace } from '@moxb/moxb';

export const mainMenu: StateSpace = [
    {
        root: true,
        label: 'All Components',
        fragment: {
            main: ApplicationAnt,
        },
    },
    {
        path: loginPath,
        //        hidden: true,
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
        path: memTablePath,
        label: 'Mem Table',
        fragment: {
            main: MemTableAnt,
        },
    },
    {
        path: moreMenuPath,
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
