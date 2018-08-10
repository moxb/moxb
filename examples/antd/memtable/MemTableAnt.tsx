import * as React from 'react';
import { NumericFormAnt, TableAnt } from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { MemTable } from './MemTable';

@inject('memTable')
@observer
export class MemTableAnt extends React.Component<{ memTable?: MemTable }> {
    render() {
        const memTable = this.props.memTable!;
        return (
            <>
                <NumericFormAnt required operation={memTable.rows} />
                <TableAnt table={memTable.table} />
            </>
        );
    }
}
