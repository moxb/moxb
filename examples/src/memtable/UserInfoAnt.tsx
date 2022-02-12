import * as React from 'react';
import { Navigable } from '@moxb/moxb';
import { UIStateSpace } from '@moxb/html';
import { MenuAndContentAnt, OneOfButtonAnt } from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { MemTable } from './MemTable';

@inject('memTable')
@observer
export class UserInfoAnt extends React.Component<Navigable<any, any> & { memTable?: MemTable }> {
    render() {
        const { parsedTokens, memTable } = this.props;

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
    }
}
