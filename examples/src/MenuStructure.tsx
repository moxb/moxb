import * as React from 'react';
import { defineNavRef, UIStateSpace, NavRefRedirect } from '@moxb/stellar-router-react';
// @ts-ignore
import lockImgUrl from '../images/lock.jpg';
import { ApplicationAnt } from './app/ApplicationAnt';

import { LoginFormAnt } from './form/LoginFormAnt';
import { MemTableAnt } from './memtable/MemTableAnt';
import { MoreMenusAnt } from './menus/MoreMenusAnt';

/**
 * We create this constant to be used as a reference for reaching a given point in the navigation tree
 */
export const memTableRef = defineNavRef<{ groupId?: string; objectId?: string }>('memTable');

export const mainMenu: UIStateSpace = {
    metaData: 'Example app main menu',
    subStates: [
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
            tokenMapping: [
                { key: 'groupId', vanishing: true, defaultValue: 'foo', allowedValues: ['foo', 'bar'] },
                'objectId',
            ],
            // This is where we attach this scheme to this part of the menu tree, meaning that we will
            // be able to address these states without knowing the path to here.
            navRef: memTableRef,
        },
        {
            key: 'moreMenus',
            label: 'More Menus',
            fragment: {
                main: MoreMenusAnt,
            },
        },
        {
            key: 'navRefMagic',
            label: 'NavRef tricks',
            subStates: [
                {
                    key: 'simpleJump',
                    label: 'Simple jump',
                    displayOnly: true,
                    // Here, we are using this NavRef to address a different part of the app.
                    // (This menu item will jump there.)
                    // (This only works if this schema has been attached to somewhere in the menu tree.)
                    navRefCall: memTableRef.call({ groupId: 'foo', objectId: 'William8' }),
                },
                {
                    key: 'encodedJump',
                    label: 'Encoded jump',
                    displayOnly: true,
                    // Here, we are going to use an encoded link, which stores all in info belonging to
                    // a NavRef call, without knowing anything about the path.
                    pathTokens: ['redirect', memTableRef.call({ groupId: 'bar', objectId: 'Mary1' }).toString()],
                },
            ],
        },
        {
            key: 'redirect',
            hidden: true,
            fragment: NavRefRedirect,
        },
    ],
    fallback: {
        main: <span>No such content</span>,
        bottom: 'Common footer text',
    },
};
