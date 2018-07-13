import * as moxb from '../../index';
import { Table } from '../Table';
import { TableColumn } from '../TableColumn';
import { TableColumnImpl } from '../TableColumnImpl';
import { TableImpl } from '../TableImpl';

describe('isInitialSort', function() {
    let bindTable: Table<any>;

    beforeEach(function() {
        bindTable = new TableImpl({
            columns: bind => [
                new moxb.TableColumnImpl({ header: 'test', accessor: 'test', isInitialSort: true }, bind),
                new moxb.TableColumnImpl({ header: 'test2', accessor: 'test2' }, bind),
            ],
        });
    });

    it('should set the initial sort column', function() {
        expect(bindTable.columns![0].sortDirection).not.toBeUndefined();
        expect(bindTable.columns![0].sortDirection).toBe('descending');
    });

    it('should set the column sorted to undefined, if isInitialSort value was not set', function() {
        expect(bindTable.columns![1].sortDirection).toBeUndefined();
    });
});

describe('sortable', function() {
    let onClick = jest.fn();
    let thisClick: any;
    let bindTable: Table<any>;

    beforeEach(function() {
        thisClick = undefined;
        onClick = jest.fn().mockImplementation(function(this: any) {
            thisClick = this;
        });
        bindTable = new TableImpl({ columns: () => [] });
    });

    it('should not make the column clickable for missing sorting prop', function() {
        const column: TableColumn = new moxb.TableColumnImpl(
            {
                header: 'test',
                accessor: 'test',
            },
            bindTable
        );
        const columnOnClick = jest.spyOn(column, 'onClick');
        columnOnClick.mockImplementation(onClick);
        column.onClick();
        expect(thisClick).not.toBeUndefined();
        expect(column.onClick).toBeCalled();
    });

    it('should make the column clickable', function() {
        const column: TableColumn = new moxb.TableColumnImpl(
            {
                header: 'test',
                accessor: 'test',
                sortable: true,
            },
            bindTable
        );
        const columnOnClick = jest.spyOn(column, 'onClick');
        columnOnClick.mockImplementation(onClick);
        column.onClick();
        expect(thisClick).not.toBeUndefined();
        expect(column.onClick).toBeCalled();
    });

    it('should call console.warn, if the accessor prop was not set', function() {
        const consoleErr = jest.spyOn(console, 'error');
        consoleErr.mockImplementation(() => {});
        const column: TableColumn = new moxb.TableColumnImpl(
            {
                header: 'test',
                sortable: true,
            },
            bindTable
        );
        expect(column).toBeInstanceOf(TableColumnImpl);
        expect(consoleErr).toHaveBeenCalled();
        consoleErr.mockRestore();
    });

    it('should call console.warn, if the onClick function was not set', function() {
        const consoleErr = jest.spyOn(console, 'error');
        consoleErr.mockImplementation(() => {});
        const column: TableColumn = new moxb.TableColumnImpl(
            {
                header: 'test',
                sortable: true,
            },
            bindTable
        );
        expect(column).toBeInstanceOf(TableColumnImpl);
        expect(consoleErr).toHaveBeenCalled();
        consoleErr.mockRestore();
    });
});
