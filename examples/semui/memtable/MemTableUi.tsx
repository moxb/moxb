import * as React from 'react';
import { TableUi } from '@moxb/semui';
import { inject, observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import { MemTable } from './MemTable';

@inject('memTable')
@observer
export class MemTableUi extends React.Component<{ memTable?: MemTable }> {
    render() {
        const memTable = this.props.memTable!;
        return (
            <TableUi table={memTable.table}>
                {memTable.table.data.map(tableData => (
                    <Table.Row key={tableData.id}>
                        <Table.Cell>{tableData.email}</Table.Cell>
                        <Table.Cell>{tableData.firstName}</Table.Cell>
                        <Table.Cell>{tableData.lastName}</Table.Cell>
                        <Table.Cell>
                            {tableData.joined
                                .toISOString()
                                .replace(/T/, ' ')
                                .replace(/:[\d.]+Z/, '')}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </TableUi>
        );
    }
}
