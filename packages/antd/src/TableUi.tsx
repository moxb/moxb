import { observer } from 'mobx-react';
import * as React from 'react';
import * as moxb from '@moxb/moxb';
import { Table, Pagination } from 'antd';
import { TableProps } from 'antd/lib/table/interface';

export interface TableUiProps extends TableProps<any> {
    table: moxb.Table<any>;
    hideHeader?: boolean;
}

function toCell(x: any) {
    if (React.isValidElement(x)) {
        return x;
    }
    return x + '';
}
@observer
export class TableUi extends React.Component<TableUiProps> {
    render() {
        const { table, ...tableProps } = this.props;
        const columns = table.columns.map(column => ({
            title: column.label,
            dataIndex: column.column,
            key: column.column,
            sorter: column.sortable,
            render: toCell,
        }));
        const dataSource = table.data.map((data, idx: number) => ({ key: idx + '', ...data }));
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
