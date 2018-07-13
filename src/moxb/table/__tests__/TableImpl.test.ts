import { Table } from '../Table';
import { TableColumn } from '../TableColumn';
import { TableImpl } from '../TableImpl';

describe('columns', function() {
    let columns = jest.fn();
    let table: Table<any>;

    beforeEach(function() {
        const fixture: TableColumn[] = [
            { header: 'test', accessor: 'test', onClick: jest.fn(), setSortDirection: jest.fn() },
        ];
        columns = jest.fn().mockReturnValue([fixture]);
        table = new TableImpl<any>({ columns: columns as any });
    });
    it('should not be empty, null or undefined', function() {
        expect(table.columns).not.toBeNull();
        expect(table.columns).not.toBeUndefined();
    });
});
