import * as moxb from '@moxb/moxb';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Table, TableProps } from 'semantic-ui-react';

//import './TableUi.styles.less';

export interface TableUiProps extends TableProps {
    table: moxb.Table<any>;
    hideHeader?: boolean;
}

export const TableUi = observer(class TableUi extends React.Component<TableUiProps> {
    render() {
        const { children, table, hideHeader, ...tableProps } = this.props;
        return (
            <Table sortable compact celled striped {...tableProps}>
                {!hideHeader && (
                    <Table.Header className="tye_bindTable">
                        <Table.Row>
                            {table.columns!.map((column, idx: number) => (
                                <Table.HeaderCell
                                    key={idx}
                                    onClick={column.toggleSort}
                                    sorted={column.sortDirection}
                                    className={column.sortDirection ? 'sortable' : ''}
                                    width={column.width as any}
                                >
                                    {column.label}
                                </Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                )}
                <Table.Body>{children}</Table.Body>
            </Table>
        );
    }
});
