import * as React from 'react';
import * as semui from '@moxb/semui';
import { TableSearchUi } from '@moxb/semui';
import { inject, observer } from 'mobx-react';
import { Form, Table } from 'semantic-ui-react';
import { MemTable } from './MemTable';

@inject('memTable')
@observer
export class MemTableUi extends React.Component<{ memTable?: MemTable }> {
    render() {
        const memTable = this.props.memTable!;
        return (
            <>
                <semui.NumericUi required operation={memTable.rows} />
                <Form.Group inline>
                    <TableSearchUi search={memTable.table.search!} />
                </Form.Group>
                <semui.TableUi table={memTable.table}>
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
                </semui.TableUi>
            </>
        );
    }
}
