import { SortOrder } from 'antd/es/table';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Table as MoxTable, t } from '@moxb/moxb';
import { Alert, Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table/interface';
import { TextSearchAnt } from './TextAnt';

export interface ColumnAntProps<T> extends ColumnProps<T> {
    dataIndex: string;
    column: string;
}

export interface TableAntProps<T> extends TableProps<any> {
    table: MoxTable<T>;
    hideHeader?: boolean;
    /**
     * Setup the column
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

@observer
export class TableAnt<T> extends React.Component<TableAntProps<T>> {
    render() {
        const { table, ...tableProps } = this.props;
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

        if (this.props.setupColumn) {
            columns.forEach((column: any) => this.props.setupColumn!(column));
        }
        const dataSource = table.data.map((data: any, idx: number) => ({ key: idx + '', ...(data as any) }));
        return (
            <>
                {table.errors!.length > 0 && (
                    <Alert message={t('Table.Error.title', 'Error')} description={table.errors} type="error" />
                )}
                {table.search && (
                    <TextSearchAnt
                        required
                        style={{ marginBottom: '1.5em' }}
                        enterButton={t('Table.Search.title', 'Search')}
                        operation={table.search.searchField}
                        onSearch={() => table.search!.searchAction.fire()}
                    />
                )}
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={!table.ready}
                    scroll={{ x: 1500 }}
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
                    onChange={(pagination, _filters, sorter) => {
                        if (table.pagination) {
                            if (pagination.pageSize) {
                                table.pagination.setPageSize(pagination.pageSize);
                            }
                            if (pagination.current != null) {
                                table.pagination.setActivePage(pagination.current);
                            }
                        }
                        if (sorter) {
                            if (!sorter.order) {
                                table.sort.clearSort();
                            } else {
                                table.sort.setSort(
                                    sorter.columnKey,
                                    sorter.order === 'ascend' ? 'ascending' : 'descending'
                                );
                            }
                        }
                        // todo filter
                    }}
                    {...tableProps}
                />
            </>
        );
    }
}
