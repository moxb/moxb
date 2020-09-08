import { toJS } from 'mobx';
import { Table } from '../Table';
import { TableColumn } from '../TableColumn';
import { TableColumnImpl } from '../TableColumnImpl';
import { TableImpl } from '../TableImpl';

describe('isInitialSort', function () {
    let bindTable: Table<any>;

    beforeEach(function () {
        bindTable = new TableImpl({
            id: 'table',
            columns: (table) => [
                new TableColumnImpl({ id: 'test', label: 'Test' }, table),
                new TableColumnImpl({ id: 'test2', label: 'Test 2' }, table),
            ],
            data: () => [],
            initialSort: [{ column: 'test2', sortDirection: 'descending' }],
        });
    });

    it('should set the initial sort column', function () {
        expect(bindTable.columns[1].sortDirection).toBe('descending');
    });

    it('should set the column sorted to undefined, if isInitialSort value was not set', function () {
        expect(bindTable.columns[0].sortDirection).toBeUndefined();
    });
});

describe('sortable', function () {
    let onClick = jest.fn();
    let thisClick: any;
    let bindTable: Table<any>;

    beforeEach(function () {
        thisClick = undefined;
        onClick = jest.fn().mockImplementation(function (this: any) {
            thisClick = this;
        });
        bindTable = new TableImpl({
            id: 'table',
            columns: (table) => [
                new TableColumnImpl({ id: 'col1' }, table),
                new TableColumnImpl({ id: 'col.asc', preferredSortDirection: 'ascending' }, table),
                new TableColumnImpl({ id: 'col.desc', preferredSortDirection: 'descending' }, table),
                new TableColumnImpl(
                    { id: 'col.desc', tableColumn: 'tcol', preferredSortDirection: 'descending' },
                    table
                ),
            ],
            data: () => [],
        });
    });

    it('should not make the column clickable for missing sorting prop', function () {
        const column: TableColumn = new TableColumnImpl(
            {
                id: 'test',
            },
            bindTable
        );
        const columnOnClick = jest.spyOn(column, 'toggleSort');
        columnOnClick.mockImplementation(onClick);
        column.toggleSort();
        expect(thisClick).not.toBeUndefined();
        expect(column.toggleSort).toBeCalled();
    });

    it('should make the column clickable', function () {
        const column = bindTable.columns[0];
        const columnOnClick = jest.spyOn(column, 'toggleSort');
        columnOnClick.mockImplementation(onClick);
        column.toggleSort();
        expect(thisClick).not.toBeUndefined();
        expect(column.toggleSort).toBeCalled();
    });
    it('should sort on tableColumn', function () {
        const column = bindTable.columns[3];
        column.toggleSort();
        expect(toJS(bindTable.sort.sort)).toEqual([{ column: 'tcol', sortDirection: 'descending' }]);
    });
});
