import * as React from 'react';
import { ActionButtonAnt, TextFormAnt, NumericFormAnt, TableAnt, ColumnAntProps } from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { MemTable, MemTableData } from '../../store/MemTable';

@inject('memTable')
@observer
export class MemTableAnt extends React.Component<{ memTable?: MemTable }> {
    render() {
        const memTable = this.props.memTable!;
        return (
            <>
                <NumericFormAnt required operation={memTable.rows} />
                {memTable.table.search && (
                    <>
                        <TextFormAnt required operation={memTable.table.search!.searchField} />
                        <ActionButtonAnt operation={memTable.table.search!.searchAction} />
                        <ActionButtonAnt operation={memTable.table.search!.clearSearch} />
                    </>
                )}
                <TableAnt table={memTable.table} setupColumn={column => this.renderColumn(column)} />
            </>
        );
    }

    /**
     * This shows how to render fields within the table.
     * @param column
     */
    renderColumn(column: ColumnAntProps<MemTableData>) {
        switch (column.column) {
            case 'joined':
                column.render = (joined, data) => data.joined.toLocaleString();
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
