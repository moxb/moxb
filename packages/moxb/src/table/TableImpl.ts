import { computed, makeObservable } from 'mobx';
import { BindImpl, BindOptions } from '../bind/BindImpl';
import { Table } from './Table';
import { TableColumn } from './TableColumn';
import { TablePagination } from './TablePagination';
import { TableSearch } from './TableSearch';
import { SortColumn, TableSort } from './TableSort';
import { TableSortImpl } from './TableSortImpl';

export interface TableOptions<T> extends BindOptions {
    columns(bind: TableImpl<T>): TableColumn[];
    data(bind: TableImpl<T>): T[];
    ready?(bind: TableImpl<T>): boolean;
    error?(bind: TableImpl<T>): any;
    readonly pagination?: TablePagination;
    readonly search?: TableSearch;
    readonly initialSort?: SortColumn[];
}

export class TableImpl<T> extends BindImpl<TableOptions<T>> implements Table<T> {
    readonly sort: TableSort;

    constructor(impl: TableOptions<T>) {
        super(impl);

        makeObservable(this, {
            ready: computed,
            columns: computed,
            data: computed,
            pagination: computed,
            search: computed
        });

        this.sort = new TableSortImpl(impl.initialSort);
    }

    get ready() {
        return this.getReady();
    }

    protected getReady(): boolean {
        return this.impl.ready ? this.impl.ready(this) : true;
    }

    get columns() {
        return this.getColumns();
    }

    protected getColumns(): TableColumn[] {
        return this.impl.columns ? this.impl.columns(this) : [];
    }

    get data() {
        return this.getData();
    }

    protected getData(): T[] {
        return this.impl.data ? this.impl.data(this) : [];
    }

    get pagination() {
        return this.impl.pagination;
    }

    get search() {
        return this.impl.search;
    }
}
