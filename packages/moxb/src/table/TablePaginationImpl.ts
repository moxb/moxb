import { action, computed, observable, makeObservable } from 'mobx';
import { TablePagination } from './TablePagination';

// ToDo: allow to specify pageSizes and default pageSize
export interface TablePaginationOptions {
    totalAmount(): number;
    pageSizes?: () => number[];
    defaultPageSize?: number;
}

export class TablePaginationImpl implements TablePagination {
    private readonly impl: TablePaginationOptions;
    @observable
    private _activePage = 1;
    @observable
    pageSize = 10;

    _pageSizes = [10, 25, 50, 100];

    constructor(impl: TablePaginationOptions) {
        makeObservable(this);
        this.impl = impl;

        if (impl.defaultPageSize) {
            this.pageSize = impl.defaultPageSize;
        }
    }

    @computed
    get pageSizes() {
        if (this.impl.pageSizes) {
            return this.impl.pageSizes();
        } else {
            return this._pageSizes;
        }
    }

    @action.bound
    setActivePage(activePage: number) {
        this._activePage = activePage;
    }

    @action.bound
    setPageSize(pageSize: number) {
        this.pageSize = pageSize;
    }

    @computed
    get totalPages() {
        if (this.pageSize <= 0) {
            return 1;
        }
        const totalPages = this.totalAmount / this.pageSize;
        if (totalPages < 1) {
            return 1;
        }
        // return an integer
        return Math.ceil(totalPages);
    }

    get hasNextPage() {
        return this._activePage < this.totalPages;
    }

    get hasPrevPage() {
        return this.activePage > 1;
    }

    @computed
    get activePage() {
        if (this._activePage < 1) {
            return 1;
        }
        if (this._activePage > this.totalPages) {
            return this.totalPages;
        }
        return this._activePage;
    }

    @computed
    get totalAmount() {
        return this.impl.totalAmount();
    }

    @computed
    get filterOptions() {
        return { skip: this.activeSkipItems, limit: this.pageSize };
    }

    /**
     * We hide it, if there is less than one page with minimal page size.
     * This shows the control even if the user sets the page size to a higher value...
     */
    get visible() {
        return this.totalAmount > this.pageSizes[0];
    }

    @computed
    private get activeSkipItems() {
        if (this.activePage === 1) {
            return 0;
        } else {
            return (this.activePage - 1) * this.pageSize;
        }
    }
}
