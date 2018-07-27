import { Table } from '../Table';
import { TableColumn } from '../TableColumn';
import { TableImpl } from '../TableImpl';
import { TableColumnImpl } from '../TableColumnImpl';

describe('columns', function() {
    let table: Table<any>;

    beforeEach(function() {
        table = new TableImpl({
            id: 'table',
            columns: t => [
                new TableColumnImpl({ id: 'col1' }, t),
                new TableColumnImpl({ id: 'col.asc', preferredSortDirection: 'ascending' }, t),
                new TableColumnImpl({ id: 'col.desc', preferredSortDirection: 'descending' }, t),
            ],
            data: () => [],
        });
    });
    it('should should be set', function() {
        expect(table.columns.length).toBe(3);
    });
});

describe('sort', function() {
    let table: Table<any>;
    beforeEach(function() {
        table = new TableImpl({
            id: 'table',
            columns: t => [
                new TableColumnImpl({ id: 'c0' }, t),
                new TableColumnImpl({ id: 'c1', preferredSortDirection: 'ascending' }, t),
                new TableColumnImpl({ id: 'c2', preferredSortDirection: 'descending' }, t),
            ],
            data: () => [],
        });
    });

    it('should be empty', function() {
        expect(table.sort.sort).toEqual([]);
    });

    it('should not change if column not sortable', function() {
        table.columns[0].toggleSort();
        expect(table.sort.sort).toEqual([]);
    });

    it('should sort the default on first toggle', function() {
        table.columns[1].toggleSort();
        expect(table.sort.sort).toEqual([{ column: 'c1', sortDirection: 'ascending' }]);
    });
    it('should reverse toggle on second toggle', function() {
        table.columns[1].toggleSort();
        table.columns[1].toggleSort();
        expect(table.sort.sort).toEqual([{ column: 'c1', sortDirection: 'descending' }]);
    });
    it('should move previous sort as secondary', function() {
        table.columns[1].toggleSort();
        table.columns[1].toggleSort();
        table.columns[2].toggleSort();
        expect(table.sort.sort).toEqual([
            { column: 'c2', sortDirection: 'descending' },
            { column: 'c1', sortDirection: 'descending' },
        ]);
    });
    it('should move first sort with defaut as first column', function() {
        table.columns[1].toggleSort();
        table.columns[2].toggleSort();
        table.columns[1].toggleSort();
        expect(table.sort.sort).toEqual([
            { column: 'c1', sortDirection: 'ascending' },
            { column: 'c2', sortDirection: 'descending' },
        ]);
    });
});
