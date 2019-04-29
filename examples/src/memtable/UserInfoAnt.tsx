import * as React from 'react';
import { Navigable, StateSpace } from '@moxb/moxb';
import { MenuAndContentAnt, OneOfButtonAnt, UIFragmentSpec } from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { MemTable } from './MemTable';

@inject('memTable')
@observer
export class UserInfoAnt extends React.Component<Navigable<any, any> & { memTable?: MemTable }> {
    render() {
        const { parsedTokens, memTable } = this.props;

        const userMenu: StateSpace<string, UIFragmentSpec, {}> = [
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
        ];

        return (
            <div>
                <h2>Selected user: {memTable!.objectId}</h2>
                <MenuAndContentAnt
                    id={'user-menu'}
                    subStates={userMenu}
                    parsedTokens={parsedTokens}
                    useTokenMappings={true}
                />
            </div>
        );
    }
}
