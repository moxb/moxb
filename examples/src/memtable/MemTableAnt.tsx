import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Row } from 'antd';

import { Anchor, ColumnAntProps, NumericFormAnt, TableAnt, TextSearchAnt } from '@moxb/antd';

import { Navigable, setArg, resetArg, NavLink } from '@moxb/stellar-router-react';
import { NavLinkButtonAnt } from '@moxb/stellar-router-antd';

import { MemTableData } from './MemTable';
import { UserInfoAnt } from './UserInfoAnt';
import { useStore } from '../store/Store';

export const MemTableAnt = observer((props: Navigable<any>) => {
    const { url, memTable } = useStore();

    /**
     * This shows how to render fields within the table.
     * @param column
     */
    function renderColumn(column: ColumnAntProps<MemTableData>) {
        switch (column.column) {
            case 'joined':
                column.render = (_, data) => data.joined.toLocaleString();
                break;
            case 'email':
                // for the fun of it, we highlight the part before the @ in the email
                column.render = (email: string) => {
                    const user = email.replace(/@.*/, '');
                    const current = memTable.objectId === user;
                    const style = current
                        ? {
                              color: 'green',
                          }
                        : {};
                    return (
                        <Anchor onClick={memTable.getHandler(user)} style={style}>
                            <b>{email.replace(/@.*/, '')}</b>
                            {email.replace(/.*@/, '@')}
                        </Anchor>
                    );
                };
                break;
        }
    }

    const { parsedTokens } = props;
    const { groupId, objectId } = url;
    return (
        <>
            <Row>
                <span>
                    <b>Group:</b> <code>'{memTable.groupId}'</code>{' '}
                </span>
                <span>
                    <b>Object:</b> <code>'{memTable.objectId}'</code>
                </span>
            </Row>
            <Row>
                Goto Group &nbsp;
                <NavLinkButtonAnt argChanges={[setArg(groupId, 'foo')]}>foo</NavLinkButtonAnt>
                &nbsp; or &nbsp;
                <NavLinkButtonAnt argChanges={[setArg(groupId, 'bar')]}>bar</NavLinkButtonAnt>
                &nbsp; or &nbsp;
                <NavLinkButtonAnt argChanges={[resetArg(groupId)]}>default</NavLinkButtonAnt>
            </Row>
            <Row>
                Goto Object{' '}
                <NavLink argChanges={[setArg(objectId, 'ObjA')]}>
                    <code>'ObjA'</code>{' '}
                </NavLink>
                or{' '}
                <NavLink argChanges={[setArg(objectId, 'ObjB')]}>
                    <code>'ObjB'</code>{' '}
                </NavLink>
                or{' '}
                <NavLink argChanges={[resetArg(objectId)]}>
                    <code>''</code>
                </NavLink>{' '}
                {!memTable.groupId && <i>(disallowed -- would normally be disabled, because no Group is specified)</i>}
            </Row>
            <Row>
                <NumericFormAnt required operation={memTable.rows} />
                <TextSearchAnt
                    operation={memTable.table.search!.searchField}
                    searchAction={memTable.table.search!.searchAction}
                />
            </Row>
            <Row>
                <TableAnt table={memTable.table} setupColumn={(column) => renderColumn(column)} />
                {memTable.hasSelection && <UserInfoAnt parsedTokens={parsedTokens! + 2} />}
            </Row>
        </>
    );
});
