import { observer } from 'mobx-react';
import * as React from 'react';
import * as moxb from '@moxb/moxb';
import { Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table/interface';

export interface ColumnAntProps<T> extends ColumnProps<T> {
    dataIndex: string;
    column: string;
}

export interface TableAntProps<T> extends TableProps<any> {
    table: moxb.Table<T>;
    hideHeader?: boolean;

    /**
     * Setup the column
     * @param column
     */
    setupColumn?(column: ColumnAntProps<T>): void;
}

function toCell(x: any, record: any) {
    if (React.isValidElement(x)) {
        return x;
    }
    return x + '';
}
@observer
export class TableAnt<T> extends React.Component<TableAntProps<T>> {
    render() {
        const { table, ...tableProps } = this.props;
        const columns = table.columns.map(column => ({
            column: column.column,
            title: column.label,
            dataIndex: column.column,
            key: column.tableColumn,
            sorter: column.sortable,
            render: toCell,
        }));
        if (this.props.setupColumn) {
            columns.forEach(column => this.props.setupColumn!(column));
        }
        const dataSource = table.data.map((data, idx: number) => ({ key: idx + '', ...(data as any) }));
        return (
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={!table.ready}
                pagination={
                    table.pagination
                        ? {
                              total: table.pagination.totalAmount,
                              showSizeChanger: true,
                              showQuickJumper: true,
                              pageSizeOptions: table.pagination.pageSizes.map(p => '' + p),
                          }
                        : undefined
                }
                onChange={(pagination, filters, sorter) => {
                    if (table.pagination) {
                        if (pagination.pageSize) {
                            table.pagination.setPageSize(pagination.pageSize);
                        }
                        if (pagination.current != null) {
                            table.pagination.setActivePage(pagination.current);
                        }
                    }
                    if (sorter) {
                        table.sort.setSort(sorter.columnKey, sorter.order === 'ascend' ? 'ascending' : 'descending');
                    }
                    // todo filter
                }}
                {...tableProps}
            />
        );
    }
}
