import { TableColumnImpl, TableImpl, TablePaginationImpl, TableSearchImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ColumnAntProps, TableAnt } from '../TableAnt';
import { shallowMoxbToJson } from './enzymeHelper';

describe('TableAnt', function() {
    const data = [
        { _id: '1', email: 'john@doe.com', fullName: 'John Doe', createdAt: '2018-01-01' },
        { _id: '2', email: 'johanna@yahoo.com', fullName: 'Johanna Doe', createdAt: '2018-05-01' },
        { _id: '3', email: 'jake@gmail.com', fullName: 'Jake Doe', createdAt: '2018-10-01' },
        { _id: '4', email: 'max@mustermann.com', fullName: 'Max Mustermann', createdAt: '2017-13-07' },
    ];
    function renderColumn(column: ColumnAntProps<any>) {
        column.render = (columnData: any) => columnData.toString();
    }
    function newTableOperation(opt?: any) {
        return new TableImpl<any>(
            Object.assign(
                {
                    id: 'table',
                    data: (tab: any) => tab.sort.sortData(data),
                    columns: (bind: any) => [
                        new TableColumnImpl(
                            {
                                id: 'email',
                                label: 'E-Mail',
                                preferredSortDirection: 'ascending',
                            },
                            bind
                        ),
                        new TableColumnImpl(
                            {
                                id: 'fullName',
                                label: 'Full Name',
                                preferredSortDirection: 'ascending',
                            },
                            bind
                        ),
                        new TableColumnImpl(
                            {
                                id: 'createdAt',
                                label: 'Joined',
                                preferredSortDirection: 'descending',
                            },
                            bind
                        ),
                    ],
                },
                ...opt
            )
        );
    }
    it('should render a table with content by default', function() {
        const operation = newTableOperation();
        expect(shallowMoxbToJson(shallow(<TableAnt table={operation} />))).toMatchSnapshot();
    });

    it('should show an alert, if an error in the table happened', function() {
        const operation = newTableOperation();
        operation.setError('New error');
        const wrapper = shallow(<TableAnt table={operation} />);
        expect(
            wrapper
                .render()
                .first()
                .find('.ant-alert-message').length
        ).toBe(1);
    });

    it('should render a table with setupColumn set', function() {
        const operation = newTableOperation();
        expect(
            shallowMoxbToJson(shallow(<TableAnt table={operation} setupColumn={column => renderColumn(column)} />))
        ).toMatchSnapshot();
    });

    it('should render a table with search field and pagination', function() {
        const operation = newTableOperation({
            search: new TableSearchImpl(),
            pagination: new TablePaginationImpl({
                totalAmount: () => 4,
            }),
        });
        expect(shallowMoxbToJson(shallow(<TableAnt table={operation} />))).toMatchSnapshot();
    });
});
