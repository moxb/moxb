export interface TableColumn {
    /**
     * the header is the title in the table header row.
     */
    readonly header?: string;

    /**
     * Called by the UI when the column header is clicked.
     */
    onClick(): void;

    /**
     * The sorted property can be either the sort direction or undefined for no sorting at all.
     */
    readonly sortDirection?: SortDirection;

    /**
     * Sets the sort direction
     * @param sortDirection
     */
    setSortDirection(sortDirection: SortDirection): void;

    /**
     * This property must be set to be sort the table according to this column
     */
    readonly sortable?: boolean;

    /**
     * Should be set true for the initial column sorting
     */
    readonly isInitialSort?: boolean;

    /**
     * The accessor is the database property name, which will be used for sorting the table.
     */
    readonly accessor?: string;

    /**
     * The width is used in the Table.HeaderCell to manually set the column width
     */
    readonly width?: number;
}

/**
 *  The SortDirection defines the sorting direction an will be used in the Semantic UI table header
 */
export type SortDirection = 'ascending' | 'descending' | undefined;
