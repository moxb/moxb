import { observer } from 'mobx-react';
import * as React from 'react';
import * as moxb from '@moxb/moxb';
import { Table } from 'antd';
import { TableProps } from 'antd/lib/table/interface';

export interface TableUiProps extends TableProps<any> {
    table: moxb.Table<any>;
    hideHeader?: boolean;
}

function convertSortDirection(preferredSortDirection: any) {
    if (preferredSortDirection === 'ascending') {
        return 'ascend';
    } else if (preferredSortDirection === 'descending') {
        return 'descend';
    }
    return preferredSortDirection;
}

@observer
export class TableUi extends React.Component<TableUiProps> {
    render() {
        const { table, ...tableProps } = this.props;
        const columns = table.columns.map(column => {
            const id = column.id.replace(table.id + '.', '');
            return {
                title: column.label,
                dataIndex: id,
                key: id,
                defaultSortOrder: convertSortDirection(column.preferredSortDirection),
                sorter: (a: any, b: any) => {
                    if (a[id] < b[id]) {
                        return -1;
                    }
                    if (a[id] > b[id]) {
                        return 1;
                    }
                    return 0;
                },
            };
        });
        const dataSource = this.props.table.data.map((data, idx: number) =>
            Object.assign({ key: idx.toString() }, ...data)
        );
        return <Table columns={columns} dataSource={dataSource} {...tableProps} />;
    }
}
