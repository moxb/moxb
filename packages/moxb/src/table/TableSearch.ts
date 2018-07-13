import { Action } from '../action/Action';
import { Text } from '../text/Text';

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
}
