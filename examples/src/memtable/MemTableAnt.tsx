import { Row } from 'antd';
import * as React from 'react';
import { NumericFormAnt, TableAnt, ColumnAntProps, LinkAnt } from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { MemTable, MemTableData } from './MemTable';
import { UsesURL } from '../store/UrlStore';

@inject('memTable', 'url')
@observer
export class MemTableAnt extends React.Component<{ memTable?: MemTable } & UsesURL> {
    render() {
        const memTable = this.props.memTable!;
        const url = this.props.url;
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
                <LinkAnt argChanges={[{ arg: url.groupId, value: 'foo' }]}>
                    <code>'foo'</code>{' '}
                </LinkAnt>
                or{' '}
                <LinkAnt argChanges={[{ arg: url.groupId, value: 'bar' }]}>
                    <code>'bar'</code>{' '}
                </LinkAnt>
                or{' '}
                <LinkAnt argChanges={[{ arg: url.groupId, value: '' }]}>
                    <code>''</code>
                </LinkAnt>
                <br /> Goto Object{' '}
                <LinkAnt argChanges={[{ arg: url.objectId, value: 'ObjA' }]}>
                    <code>'ObjA'</code>{' '}
                </LinkAnt>
                or{' '}
                <LinkAnt argChanges={[{ arg: url.objectId, value: 'ObjB' }]}>
                    <code>'ObjB'</code>{' '}
                </LinkAnt>
                or{' '}
                <LinkAnt argChanges={[{ arg: url.objectId, value: '' }]}>
                    <code>''</code>
                </LinkAnt>{' '}
                {!memTable.groupId && <i>(disallowed -- would normally be disabled, because no Group is specified)</i>}
                <NumericFormAnt required operation={memTable.rows} />
                <TableAnt table={memTable.table} setupColumn={column => this.renderColumn(column)} />
            </Row>
        );
    }

    /**
     * This shows how to render fields within the table.
     * @param column
     */
    renderColumn(column: ColumnAntProps<MemTableData>) {
        switch (column.column) {
            case 'joined':
                column.render = (_, data) => data.joined.toLocaleString();
                break;
            case 'email':
                // for the fun of it, we highlight the parf before the @ in the email
                column.render = (email: string) => (
                    <>
                        <b>{email.replace(/@.*/, '')}</b>
                        {email.replace(/.*@/, '@')}
                    </>
                );
                break;
        }
    }
}
