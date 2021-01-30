import { Anchor, ColumnAntProps, NavLink, NumericFormAnt, TableAnt, TextSearchAnt } from '@moxb/antd';
import { Row } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { UsesURL } from '../store/UrlStore';
import { MemTable, MemTableData } from './MemTable';
import { Navigable, setArg, resetArg } from '@moxb/moxb';
import { UserInfoAnt } from './UserInfoAnt';

@inject('memTable', 'url')
@observer
export class MemTableAnt extends React.Component<{ memTable?: MemTable } & UsesURL & Navigable<any, any>> {
    render() {
        const memTable = this.props.memTable!;
        const { url, parsedTokens } = this.props;
        const { groupId, objectId } = url;
        return (
            <Row>
                <span>
                    <b>Group:</b> <code>'{memTable.groupId}'</code>{' '}
                </span>
                <span>
                    <b>Object:</b> <code>'{memTable.objectId}'</code>
                </span>
                <br />
                Goto Group{' '}
                <NavLink argChanges={[setArg(groupId, 'foo')]}>
                    <code>'foo'</code>{' '}
                </NavLink>
                or{' '}
                <NavLink argChanges={[setArg(groupId, 'bar')]}>
                    <code>'bar'</code>{' '}
                </NavLink>
                or{' '}
                <NavLink argChanges={[resetArg(groupId)]}>
                    <code>''</code>
                </NavLink>
                <br /> Goto Object{' '}
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
                <NumericFormAnt required operation={memTable.rows} />
                <TextSearchAnt
                    operation={memTable.table.search!.searchField}
                    searchAction={memTable.table.search!.searchAction}
                />
                <TableAnt table={memTable.table} setupColumn={(column) => this.renderColumn(column)} />
                {memTable.hasSelection && <UserInfoAnt parsedTokens={parsedTokens! + 2} />}
            </Row>
        );
    }

    /**
     * This shows how to render fields within the table.
     * @param column
     */
    renderColumn(column: ColumnAntProps<MemTableData>) {
        const memTable = this.props.memTable!;
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
}
