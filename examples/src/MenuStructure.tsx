import * as React from 'react';

import { LoginFormAnt } from './form/LoginFormAnt';
import { MemTableAnt } from './memtable/MemTableAnt';
import { ApplicationAnt } from './app/ApplicationAnt';

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
        label: 'Login Form',
        fragment: <LoginFormAnt />,
    },
    {
        path: 'memTable',
        label: 'Mem Table',
        fragment: <MemTableAnt />,
    },
];

export const missingContent = <span>No such content</span>;
