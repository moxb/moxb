import { action, makeObservable } from 'mobx';
import { BindImpl, BindOptions } from '../bind/BindImpl';
import { Table } from './Table';
import { TableColumn } from './TableColumn';
import { SortDirection } from './TableSort';

//ToDo: Add documentation :)
export interface TableColumnOptions extends BindOptions {
    column?: string;
    tableColumn?: string;
    sortable?: boolean;
    preferredSortDirection?: SortDirection;
    width?: number;
    fixed?: 'left' | 'right';
}

export class TableColumnImpl extends BindImpl<TableColumnOptions> implements TableColumn {
    readonly column: string;
    readonly tableColumn: string;

    constructor(impl: TableColumnOptions, private readonly table: Table<any>) {
        super({ ...impl, id: table.id + '.' + impl.id });
        makeObservable(this);
        this.column = impl.column || impl.id;
        this.tableColumn = impl.tableColumn || this.column;
    }

    // We need to separate the actual method triggering the search from the public API,
    // so that we can use a jest spy on the public API.
    // (The mobx-wrapped action can't be wrapped by the spy.)
    @action.bound
    private _toggleSort() {
        this.table.sort.toggleSort(this.tableColumn, this.preferredSortDirection);
    }

    toggleSort() {
        this._toggleSort();
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
