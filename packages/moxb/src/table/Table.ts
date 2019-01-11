/**
 * This is a representation of the table with extended functionality:
 * https://react.semantic-ui.com/modules/tables
 */
import { Bind } from '../bind/Bind';
import { TableColumn } from './TableColumn';
import { TablePagination } from './TablePagination';
import { TableSearch } from './TableSearch';
import { TableSort } from './TableSort';

export interface Table<T, CustomData = undefined> extends Bind<CustomData> {
    readonly ready: boolean;

    /**
     * The metadata about the columns in the table
     */
    readonly columns: TableColumn[];

    /**
     * The data that is associated with the table
     */
    readonly data: T[];

    readonly sort: TableSort;

    readonly pagination?: TablePagination;

    readonly search?: TableSearch;
}
