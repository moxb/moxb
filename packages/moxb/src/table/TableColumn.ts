import { SortDirection } from './TableSort';
import { Bind } from '..';

export interface TableColumn extends Bind {
    /**
     * The name of the column in the table.
     */
    readonly column: string;

    /**
     * the header is the title in the table header row.
     */
    readonly header?: string;

    /**
     * Should be called when the column is clicked to sort on this column. If the column is not sortable, nothing
     * happens.
     */
    toggleSort(): void;

    /**
     * If column is not sortable, this is undefined. Else this is the preferred (natural) sort direction.
     */
    readonly preferredSortDirection?: SortDirection;

    /**
     * The current sort direction if it the column is the primary sort column
     */
    readonly sortDirection?: SortDirection;

    /**
     * The width is used in the Table.HeaderCell to manually set the column width
     */
    readonly width?: number;
}
