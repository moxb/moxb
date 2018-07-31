import * as React from 'react';
import { NumericFormUi, TableUi } from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { MemTable } from './MemTable';

@inject('memTable')
@observer
export class MemTableUi extends React.Component<{ memTable?: MemTable }> {
    render() {
        const memTable = this.props.memTable!;
        return (
            <>
                <NumericFormUi required operation={memTable.rows} />
                <TableUi table={memTable.table} />
            </>
        );
    }
}
