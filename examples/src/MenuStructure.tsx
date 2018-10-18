import * as React from 'react';

import { LoginFormAnt } from './form/LoginFormAnt';
import { MemTableAnt } from './memtable/MemTableAnt';
import { ApplicationAnt } from './app/ApplicationAnt';

import lockImgUrl from "../images/lock.jpg";

import {
    //    UrlArg,
    //    URLARG_TYPE_STRING,
    StateSpace,
} from '@moxb/moxb';

export const mainMenu: StateSpace = [
    {
        path: 'index',
        root: true,
        label: 'All Components',
        fragment: <ApplicationAnt />,
    },
    {
        path: 'loginForm',
        label: <span><img src={ lockImgUrl } width="32"/>Login Form</span>,
        fragment: <LoginFormAnt />,
    },
    {
        path: 'memTable',
        label: 'Mem Table',
        fragment: <MemTableAnt />,
    },
];

export const missingContent = <span>No such content</span>;
