import { Row } from 'antd';
import * as React from 'react';
import { NumericFormAnt, TableAnt, ColumnAntProps } from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { MemTable, MemTableData } from './MemTable';
import { ArgChangingLink } from '@moxb/antd';

@inject('memTable', 'url')
@observer
export class MemTableAnt extends React.Component<{ memTable?: MemTable }> {
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
                <ArgChangingLink arg={url.groupId} value="foo">
                    <code>'foo'</code>{' '}
                </ArgChangingLink>
                or{' '}
                <ArgChangingLink arg={url.groupId} value="bar">
                    <code>'bar'</code>{' '}
                </ArgChangingLink>
                or{' '}
                <ArgChangingLink arg={url.groupId} value="">
                    <code>''</code>
                </ArgChangingLink>
                <br /> Goto Object{' '}
                <ArgChangingLink arg={url.objectId} value="ObjA">
                    <code>'ObjA'</code>{' '}
                </ArgChangingLink>
                or{' '}
                <ArgChangingLink arg={url.objectId} value="ObjB">
                    <code>'ObjB'</code>{' '}
                </ArgChangingLink>
                or{' '}
                <ArgChangingLink arg={url.objectId} value="">
                    <code>''</code>
                </ArgChangingLink>{' '}
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
