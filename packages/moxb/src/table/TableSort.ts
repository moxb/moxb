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
     * @param {string} column
     * @param {SortDirection} preferredSortDirection
     */
    toggleSort(column: string, preferredSortDirection: SortDirection): void;

    /**
     * Sets to the sort columns. SortColumns with other column will be pushed to the end.
     * @param {string} column
     * @param {SortDirection} sortDirection
     */
    setSort(column: string, sortDirection: SortDirection): void;

    /**
     * Sorts the data and returns a new sorted array unless <code>inline===true</code>
     * @param {T[]} data
     * @param {boolean} inline optional parameter to sort data directly and not returning a copy
     * @returns {T[]}
     */
    sortData<T>(data: T[], inline?: boolean): T[];

    /**
     * Clears the list of sort columns
     */
    clearSort(): void;
}
