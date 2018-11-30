import { action } from 'mobx';
import { Table } from './Table';
import { TableColumn } from './TableColumn';
import { SortDirection } from './TableSort';
import { BindImpl, BindOptions } from '../bind/BindImpl';

//ToDo: Add documentation :)
export interface TableColumnOptions<CustomData = undefined> extends BindOptions<CustomData> {
    column?: string;
    tableColumn?: string;
    sortable?: boolean;
    preferredSortDirection?: SortDirection;
    width?: number;
    fixed?: 'left' | 'right';
}

export class TableColumnImpl<CustomData = undefined> extends BindImpl<TableColumnOptions<CustomData>, CustomData>
    implements TableColumn<CustomData> {
    readonly column: string;
    readonly tableColumn: string;
    constructor(impl: TableColumnOptions<CustomData>, private readonly table: Table<any>) {
        super({ ...impl, id: table.id + '.' + impl.id });
        this.column = impl.column || impl.id;
        this.tableColumn = impl.tableColumn || this.column;
    }

    @action.bound
    toggleSort() {
        this.table.sort.toggleSort(this.tableColumn, this.preferredSortDirection);
    }

    get preferredSortDirection() {
        return this.impl.preferredSortDirection;
    }

    get sortable() {
        return !!this.impl.preferredSortDirection;
    }

    get sortDirection() {
        if (this.table.sort.sort.length === 0) {
            return undefined;
        }
        const sort = this.table.sort.sort[0];
        if (sort.column === this.tableColumn) {
            return sort.sortDirection;
        }
        return undefined;
    }

    get width() {
        if (this.impl.width) {
            return this.impl.width;
        }
    }

    get fixed() {
        if (this.impl.fixed) {
            return this.impl.fixed;
        }
    }
}
