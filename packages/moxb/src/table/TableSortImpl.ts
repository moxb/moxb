import { action, observable, makeObservable } from 'mobx';
import { SortColumn, SortDirection, TableSort } from './TableSort';

export class TableSortImpl implements TableSort {
    sort: SortColumn[];
    constructor(sort?: SortColumn[]) {
        makeObservable(this, {
            sort: observable,
            toggleSort: action.bound,
            setSort: action.bound,
            clearSort: action.bound
        });

        this.sort = sort || [];
    }
    toggleSort(column: string, preferredSortDirection: SortDirection) {
        if (!preferredSortDirection) {
            return;
        }
        let sortDirection = preferredSortDirection;
        if (this.sort.length && this.sort[0].column === column) {
            sortDirection = this.sort[0].sortDirection === 'ascending' ? 'descending' : 'ascending';
        }
        this.setSort(column, sortDirection);
    }

    setSort(column: string, sortDirection: SortDirection) {
        const sort = { column, sortDirection };
        this.sort = [sort, ...this.sort.filter((c) => c.column !== sort.column)];
    }

    clearSort() {
        this.sort = [];
    }

    sortData<T>(data: T[], inline?: boolean): T[] {
        const sortData: any[] = inline ? data : data.slice();
        sortData.sort((a: any, b: any) => {
            for (let i = 0; i < this.sort.length; i++) {
                const order = this.sort[i];
                const mul = order.sortDirection === 'descending' ? 1 : -1;
                const x = a[order.column];
                const y = b[order.column];
                if (x < y) {
                    return mul;
                }
                if (x > y) {
                    return -mul;
                }
            }
            return 0;
        });
        return sortData;
    }
}
