import { observer } from 'mobx-react';
import * as React from 'react';
import { Table, TableProps } from 'semantic-ui-react';
import { Table as MoxbTable } from './Table';
import { TableColumn } from './TableColumn';

import './TableUi.styles.less';

interface TableUiProps extends TableProps {
    table: MoxbTable<any>;
    hideHeader?: boolean;
}

@observer
export class TableUi extends React.Component<TableUiProps> {
    render() {
        const { children, table, hideHeader, ...tableProps } = this.props;
        return (
            <Table sortable compact celled striped {...tableProps}>
                {!hideHeader && (
                    <Table.Header className="tye_bindTable">
                        <Table.Row>
                            {table.columns!.map((column: TableColumn, idx: number) => {
                                if (!column.sortable) {
                                    return (
                                        <Table.HeaderCell key={idx} width={column.width as any}>
                                            {column.header}
                                        </Table.HeaderCell>
                                    );
                                } else {
                                    return (
                                        <Table.HeaderCell
                                            key={idx}
                                            onClick={column.onClick}
                                            sorted={column.sortDirection}
                                            className="sortable"
                                            width={column.width as any}
                                        >
                                            {column.header}
                                        </Table.HeaderCell>
                                    );
                                }
                            })}
                        </Table.Row>
                    </Table.Header>
                )}
                <Table.Body>{children}</Table.Body>
            </Table>
        );
    }
}
