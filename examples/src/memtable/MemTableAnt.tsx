import { Row } from 'antd';
import { Layout } from 'antd';
import * as React from 'react';
import { NumericFormAnt, TableAnt, ColumnAntProps } from '@moxb/antd';
import { inject, observer } from 'mobx-react';
import { NavigationAnt } from '../common/NavigationAnt';
import { MemTable, MemTableData } from './MemTable';

@inject('memTable')
@observer
export class MemTableAnt extends React.Component<{ memTable?: MemTable }> {
    render() {
        const memTable = this.props.memTable!;
        return (
            <Layout>
                <Layout.Content>
                    <Row>
                        <NavigationAnt />
                    </Row>
                    <Row>
                        <NumericFormAnt required operation={memTable.rows} />
                        <TableAnt table={memTable.table} setupColumn={column => this.renderColumn(column)} />
                    </Row>
                </Layout.Content>
            </Layout>
        );
    }

    /**
     * This shows how to render fields within the table.
     * @param column
     */
    renderColumn(column: ColumnAntProps<MemTableData>) {
        switch (column.column) {
            case 'joined':
                column.render = (joined, data) => data.joined.toLocaleString();
                break;
            case 'email':
                // for the fun of it, we highlight the parf before the @ in the email
                column.render = (email: string) => (
                    <>
                        <b>{email.replace(/@.*/, '')}</b>
                        {email.replace(/.*@/, '@')}
                    </>
                );
                break;
        }
    }
}