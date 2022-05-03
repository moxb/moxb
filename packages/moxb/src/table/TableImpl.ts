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
        makeObservable(this);
        this.sort = new TableSortImpl(impl.initialSort);
    }

    @computed
    get ready() {
        return this.getReady();
    }

    protected getReady(): boolean {
        return this.impl.ready ? this.impl.ready(this) : true;
    }

    @computed
    get columns() {
        return this.getColumns();
    }

    protected getColumns(): TableColumn[] {
        return this.impl.columns ? this.impl.columns(this) : [];
    }

    @computed
    get data() {
        return this.getData();
    }

    protected getData(): T[] {
        return this.impl.data ? this.impl.data(this) : [];
    }

    @computed
    get pagination() {
        return this.impl.pagination;
    }

    @computed
    get search() {
        return this.impl.search;
    }
}
