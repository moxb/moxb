import { action, observable } from 'mobx';
import { Table } from './Table';
import { SortDirection, TableColumn } from './TableColumn';

interface TableColumnOptions {
    header: string;
    accessor?: string;
    sortable?: boolean;
    isInitialSort?: boolean;
    width?: number;
}

export class TableColumnImpl implements TableColumn {
    private readonly impl: TableColumnOptions;
    private readonly table: Table<any>;
    @observable sortDirection: SortDirection;

    constructor(impl: TableColumnOptions, tableImpl: Table<any>) {
        this.impl = impl;
        this.table = tableImpl;
        // Set the initial sort filter column
        this.sortDirection = this.impl.isInitialSort ? 'descending' : undefined;

        if (this.impl.sortable) {
            if (!this.impl.accessor) {
                console.error(`To make a column sortable, you also have to set the accessor property.`);
            }
        }
    }

    @action.bound
    onClick(): void {
        if (this.table.sortAccessor !== this.accessor) {
            // Reset the UI props before setting the newly selected column
            this.table.columns!.forEach((col: TableColumn) => col.setSortDirection(undefined));
            this.table.setSortAccessor(this.accessor);
            this.table.setSortDirection('descending');
        } else {
            this.table.setSortDirection(this.sortDirection === 'ascending' ? 'descending' : 'ascending');
        }
        this.sortDirection = this.table.sortDirection;
    }

    @action.bound
    setSortDirection(sortDirection: SortDirection): void {
        this.sortDirection = sortDirection;
    }

    get header() {
        if (this.impl.header) {
            return this.impl.header;
        }
    }

    get accessor() {
        if (this.impl.accessor) {
            return this.impl.accessor;
        }
    }

    get sortable() {
        if (this.impl.sortable) {
            return this.impl.sortable;
        }
    }

    get isInitialSort() {
        if (this.impl.isInitialSort) {
            return this.impl.isInitialSort;
        }
    }

    get width() {
        if (this.impl.width) {
            return this.impl.width;
        }
    }
}
