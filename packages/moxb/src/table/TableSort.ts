/**
 *  The SortDirection defines the sorting direction an will be used in the Semantic UI table header
 */
export type SortDirection = 'ascending' | 'descending' | undefined;

export interface SortColumn {
    column: string;
    sortDirection: SortDirection;
}

export interface TableSort {
    /**
     * A list of columns to sort on. The first is the first sort criterion.
     */
    sort: SortColumn[];

    /**
     * Sets to the sort columns. SortColumns with other column will be pushed to the end.
     * @param sortColumn
     */
    toggleSort(column: string, preferredSortDirection: SortDirection): void;
    /**
     * Sets to the sort columns. SortColumns with other column will be pushed to the end.
     * @param sortColumn
     */
    setSort(column: string, sortDirection: SortDirection): void;
}
