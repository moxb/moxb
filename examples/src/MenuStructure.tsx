import * as React from 'react';

import { LoginFormAnt, PATH as loginPath } from './form/LoginFormAnt';
import { MemTableAnt, PATH as memTablePath } from './memtable/MemTableAnt';
import { ApplicationAnt } from './app/ApplicationAnt';
import { MoreMenusAnt, PATH as moreMenuPath } from './menus/MoreMenusAnt';

import lockImgUrl from "../images/lock.jpg";

import { StateSpace } from '@moxb/moxb';

export const mainMenu: StateSpace = [
    {
        path: 'index',
        root: true,
        label: 'All Components',
        fragment: <ApplicationAnt />,
    },
    {
        path: loginPath,
        label: (
            <span>
                <img src={ lockImgUrl } width="32"/>
                Login Form
            </span>
        ),
        fragment: <LoginFormAnt />,
    },
    {
        path: memTablePath,
        label: 'Mem Table',
        fragment: <MemTableAnt />,
    },
    {
        path: moreMenuPath,
        label: 'More Menus',
        fragment: <MoreMenusAnt />,
    },    
];

export const missingContent = <span>No such content</span>;
