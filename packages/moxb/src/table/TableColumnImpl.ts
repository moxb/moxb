import { action, observable } from 'mobx';
import { Table } from './Table';
import { TableColumn } from './TableColumn';
import { SortDirection } from './TableSort';
import { BindImpl, BindOptions } from '../bind/BindImpl';

export interface TableColumnOptions extends BindOptions {
    sortable?: boolean;
    preferredSortDirection?: SortDirection;
    width?: number;
}

export class TableColumnImpl extends BindImpl<TableColumnOptions> implements TableColumn {
    readonly column: string;
    constructor(impl: TableColumnOptions, private readonly table: Table<any>) {
        super({ ...impl, id: table.id + '.' + impl.id });
        this.column = impl.id;
    }

    @action.bound
    toggleSort() {
        this.table.sort.toggleSort(this.column, this.preferredSortDirection);
    }

    get preferredSortDirection() {
        return this.impl.preferredSortDirection;
    }

    get sortDirection() {
        const sort = this.table.sort.sort[0];
        if (sort && sort.column === this.column) {
            return sort.sortDirection;
        }
        return undefined;
    }

    get width() {
        if (this.impl.width) {
            return this.impl.width;
        }
    }
}
