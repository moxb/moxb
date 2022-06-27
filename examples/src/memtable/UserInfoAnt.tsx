import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { OneOfButtonAnt } from '@moxb/antd';

import { Navigable } from '@moxb/stellar-router-core';
import { UIStateSpace } from '@moxb/stellar-router-react';
import { MenuAndContentAnt } from '@moxb/stellar-router-antd';

import { useStore } from '../store/Store';

export const UserInfoAnt = observer((props: Navigable<any>) => {
    const { parsedTokens } = props;
    const { memTable } = useStore();

    const userMenu: UIStateSpace = {
        metaData: 'User menu of example app',
        subStates: [
            {
                root: true,
                label: 'User home',
                fragment: <div>User home</div>,
            },
            {
                key: 'items',
                label: 'Items',
                fragment: (
                    <div>
                        User items <OneOfButtonAnt operation={memTable!.item} />
                    </div>
                ),
                tokenMapping: ['itemKey'],
            },
        ],
    };

    return (
        <div>
            <h2>Selected user: {memTable!.objectId}</h2>
            <MenuAndContentAnt
                id={'user-menu'}
                stateSpace={userMenu}
                parsedTokens={parsedTokens}
                useTokenMappings={true}
            />
        </div>
    );
});
