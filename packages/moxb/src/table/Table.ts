/**
 * This is a representation of the table with extended functionality:
 * https://react.semantic-ui.com/modules/tables
 */
import { SortDirection, TableColumn } from './TableColumn';

export interface TableSortField {
    [id: string]: SortDirection;
}

export interface Table<T> {
    /**
     * The data that is associated with the dialog
     */
    readonly columns?: TableColumn[];

    /**
     * The data that is associated with the table
     */
    readonly data?: T[] | undefined;

    /**
     * The sortAccessor saves the currently selected sorting column of the table.
     */
    readonly sortAccessor?: string;

    /**
     * Sets the sort column || may be undefined to clear the sorting
     * @param sortAccessor
     */
    setSortAccessor(sortAccessor: string | undefined): void;

    /**
     * The sortDirection defines the sorting direction of the current sorting column.
     */
    readonly sortDirection: SortDirection;

    setSortDirection(sortDirection: SortDirection): void;

    /**
     * The sortOption defines the sorting options for the table query.
     */
    readonly sortOptions: TableSortField[];
}
