import { Action } from '../action/Action';
import { Text } from '../text/Text';
import { QueryFilter } from '../query/QueryFilter';

export interface TableSearch {
    /**
     *  The searchField is the user form input field for the search query.
     */
    readonly searchField: Text;

    /**
     *  The searchAction is used in the form submit button to generate the query.
     */
    readonly searchAction: Action;

    /**
     *  The clearSearch is used in the form to clear the search input field.
     */
    readonly clearSearch: Action;

    /**
     *  The query string value is used for the database search query.
     */
    readonly query: string;

    /**
     *  The query filter currently used for the database search query.
     *  Do not modify the query here directly, modify it in `searchField` then call `searchAction.fire()`.
     */
    readonly queryFilter: QueryFilter;

    /**
     *  The query filter currently used by the search field.
     *  You may add or remove condition in this filter and it will update the text in the searchField.
     */
    readonly searchFieldFilter: QueryFilter;
}
