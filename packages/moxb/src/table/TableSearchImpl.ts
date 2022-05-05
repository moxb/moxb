import { action, observable, makeObservable } from 'mobx';
import { Action } from '../action/Action';
import { ActionImpl } from '../action/ActionImpl';
import { Text } from '../text/Text';
import { TextImpl } from '../text/TextImpl';
import { TableSearch } from './TableSearch';
import { QueryFilter } from '../query/QueryFilter';
import { QueryFilterImpl } from '../query/QueryFilterImpl';

export class TableSearchImpl implements TableSearch {
    @observable
    query = '';

    readonly searchField: Text = new TextImpl({
        id: 'TableSearch.searchField',
        placeholder: 'Search...',
        initialValue: () => this.query,
    });

    readonly searchAction: Action = new ActionImpl({
        id: 'TableSearch.searchAction',
        label: 'Search',
        fire: () => this.setQuery(this.searchField.value || ''),
    });

    readonly clearSearch: Action = new ActionImpl({
        id: 'TableSearch.clearSearchAction',
        label: 'Clear',
        fire: () => {
            this.setQuery('');
            this.searchField.resetToInitialValue();
        },
    });

    constructor() {
        makeObservable(this);
    }

    @action.bound
    setQuery(query: string) {
        this.query = query;
    }

    readonly queryFilter: QueryFilter = new QueryFilterImpl({
        getQuery: () => this.query,
        setQuery: (value) => this.setQuery(value),
    });

    readonly searchFieldFilter: QueryFilter = new QueryFilterImpl({
        getQuery: () => this.searchField.value || '',
        setQuery: (query: string) => {
            this.searchField.setValue(query);
        },
    });
}
