import { t, Table as MoxTable } from '@moxb/moxb';
import { Alert, Table } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { ColumnProps, TableProps } from 'antd/lib/table';
import { TablePaginationConfig } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';

export interface ColumnAntProps<T> extends ColumnProps<T> {
    dataIndex: string;
    column: string;
}

export interface TableAntProps<T> extends TableProps<any> {
    table: MoxTable<T>;
    hideHeader?: boolean;

    /**
     * Set up the column
     * @param column
     */
    setupColumn?(column: ColumnAntProps<T>): void;
}

function toCell(x: any) {
    if (React.isValidElement(x)) {
        return x;
    }
    return x + '';
}

function toSortOrder(sortColumn: any): SortOrder | undefined {
    if (!sortColumn) {
        return undefined;
    }
    return sortColumn.sortDirection === 'ascending' ? 'ascend' : 'descend';
}

export const TableAnt = observer((props: TableAntProps<any>) => {
    const { table, ...tableProps } = props;

    // eslint-disable-next-line complexity
    function handleChange(
        pagination: TablePaginationConfig,
        _filters: any,
        sorter: SorterResult<any> | SorterResult<any>[]
    ) {
        if (table.pagination) {
            if (pagination.pageSize) {
                table.pagination.setPageSize(pagination.pageSize);
            }
            if (pagination.current != null) {
                table.pagination.setActivePage(pagination.current);
            }
        }
        if (sorter) {
            const s = Array.isArray(sorter) ? sorter[0] : sorter;
            if (!s.order) {
                table.sort.clearSort();
            } else {
                const col =
                    typeof s.columnKey === 'string'
                        ? s.columnKey
                        : typeof s.columnKey === 'number'
                        ? s.columnKey.toString(10)
                        : '';
                table.sort.setSort(col, s.order === 'ascend' ? 'ascending' : 'descending');
            }
        }
    }

    const sort: any = table.sort.sort.length ? table.sort.sort[0] : {};
    const columns = table.columns.map((column: any) => ({
        column: column.column,
        title: column.label,
        dataIndex: column.column,
        key: column.tableColumn,
        sorter: column.sortable,
        width: column.width || undefined,
        fixed: column.fixed || undefined,
        defaultSortOrder: toSortOrder(column.preferredSortDirection),
        sortOrder: sort.column === column.column && (toSortOrder(sort) as any),
        render: toCell,
    }));

    if (props.setupColumn) {
        columns.forEach((column: any) => props.setupColumn!(column));
    }
    const dataSource = table.data.map((data: any, idx: number) => ({
        key: idx + '',
        ...data,
    }));
    return (
        <>
            {table.errors!.length > 0 && (
                <Alert message={t('Table.Error.title', 'Error')} description={table.errors} type="error" />
            )}
            <Table
                data-testid={table.id}
                columns={columns}
                dataSource={dataSource}
                loading={!table.ready}
                pagination={
                    table.pagination
                        ? {
                              total: table.pagination.totalAmount,
                              current: table.pagination.activePage,
                              showSizeChanger: true,
                              showQuickJumper: true,
                              pageSizeOptions: table.pagination.pageSizes.map((p) => '' + p),
                              pageSize: table.pagination.pageSize,
                          }
                        : undefined
                }
                onChange={handleChange}
                {...tableProps}
            />
        </>
    );
});
