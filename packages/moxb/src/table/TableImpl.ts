import { action, computed, observable } from 'mobx';
import { Table } from './Table';
import { TableColumn } from './TableColumn';
import { TablePagination } from './TablePagination';
import { TableSearch } from './TableSearch';
import { SortColumn, TableSort } from './TableSort';
import { TableSortImpl } from './TableSortImpl';
import { BindImpl, BindOptions } from '../bind/BindImpl';

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
        this.sort = new TableSortImpl(impl.initialSort);
    }

    @computed
    get ready() {
        return this.getReady();
    }

    // ToDo: write a higher order function to compass
    // ToDo: the if impl.func call the impl.func otherwise return something
    // ToDo: Or just simply use the ?: operators and it is a one-liner
    protected getReady(): boolean {
        if (this.impl.ready) {
            return this.impl.ready(this);
        }
        return true;
    }

    @computed
    get columns() {
        return this.getColumns();
    }

    protected getColumns(): TableColumn[] {
        if (this.impl.columns) {
            return this.impl.columns(this);
        }
        return [];
    }

    @computed
    get data() {
        return this.getData();
    }

    protected getData(): T[] {
        if (this.impl.data) {
            return this.impl.data(this);
        }
        return [];
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
