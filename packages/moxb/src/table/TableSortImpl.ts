import { action, observable, toJS } from 'mobx';
import { SortColumn, SortDirection, TableSort } from './TableSort';

export class TableSortImpl implements TableSort {
    @observable sort: SortColumn[];
    constructor(sort?: SortColumn[]) {
        this.sort = sort || [];
    }
    @action.bound
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

    @action.bound
    setSort(column: string, sortDirection: SortDirection) {
        const sort = { column, sortDirection };
        this.sort = [sort, ...this.sort.filter(c => c.column !== sort.column)];
    }
}
