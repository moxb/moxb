import { action, observable } from 'mobx';
import { Action } from '../action/Action';
import { ActionImpl } from '../action/ActionImpl';
import { Text } from '../text/Text';
import { TextImpl } from '../text/TextImpl';
import { TableSearch } from './TableSearch';

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
        enabled: () => !this.searchField.isInitialValue,
    });

    readonly clearSearch: Action = new ActionImpl({
        id: 'TableSearch.clearSearchAction',
        label: 'Clear',
        fire: () => {
            this.searchField.setValue('');
            this.setQuery('');
        },
        enabled: () => this.searchField.value !== '',
    });

    @action.bound
    setQuery(query: string) {
        this.query = query;
    }
}
