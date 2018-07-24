import { action, computed, observable } from 'mobx';
import { Table, TableSortField } from './Table';
import { SortDirection, TableColumn } from './TableColumn';

export interface TableOptions<T> {
    columns?(bind: any): TableColumn[];
    data?(): T[] | undefined;
}

export class TableImpl<T> implements Table<T> {
    protected readonly impl: TableOptions<T>;
    @observable sortAccessor? = '_id';
    @observable sortDirection: SortDirection = 'descending';

    constructor(impl: TableOptions<T>) {
        this.impl = impl;

        if (this.impl.columns) {
            this.columns!.forEach(column => {
                if (column.isInitialSort) {
                    this.sortAccessor = column.accessor!;
                }
            });
        }
    }

    @action
    setSortAccessor(sortAccessor?: string): void {
        this.sortAccessor = sortAccessor;
    }

    @action
    setSortDirection(sortDirection: SortDirection): void {
        this.sortDirection = sortDirection;
    }

    @computed
    get sortOptions() {
        const sorting: TableSortField[] = [];
        if (this.sortAccessor) {
            sorting.push({ [this.sortAccessor]: this.sortDirection });
        }
        return sorting;
    }

    @computed
    get columns() {
        return this.getColumns();
    }

    protected getColumns() {
        if (this.impl.columns) {
            return this.impl.columns(this);
        }
        return undefined;
    }
    @computed
    get data() {
        return this.getData();
    }

    protected getData() {
        if (this.impl.data) {
            return this.impl.data();
        }
        return undefined;
    }
}
