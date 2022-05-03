import { NumericUi, TablePaginationUi, TableSearchUi, TableUi } from '@moxb/semui';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Container, Form, Table } from 'semantic-ui-react';
import { NavigationUi } from '../common/NavigationUi';
import { useStore } from '../store/Store';

export const MemTableUi = observer(() => {
    const { memTable } = useStore();
    return (
        <Container text>
            <NavigationUi />
            <NumericUi required operation={memTable.rows} />
            <Form.Group inline>
                <TableSearchUi search={memTable.table.search!} />
            </Form.Group>
            <TableUi table={memTable.table}>
                {memTable.table.data.map((tableData) => (
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
            <TablePaginationUi pagination={memTable.table.pagination!} />
        </Container>
    );
});
