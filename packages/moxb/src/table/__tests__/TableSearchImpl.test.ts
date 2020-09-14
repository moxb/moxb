import { TableSearchImpl } from '../TableSearchImpl';

describe('TableSearchImpl', function () {
    it('should properly bind queryFilter and searchFieldFilter', function () {
        const search = new TableSearchImpl();

        expect(search.queryFilter.queryString.getQuery()).toBe('');
        expect(search.searchFieldFilter.queryString.getQuery()).toBe('');

        search.queryFilter.queryString.setQuery('query string');
        expect(search.queryFilter.queryString.getQuery()).toBe('query string');
        expect(search.query).toBe('query string');

        search.searchFieldFilter.queryString.setQuery('query 2');
        expect(search.queryFilter.queryString.getQuery()).toBe('query string');
        expect(search.searchFieldFilter.queryString.getQuery()).toBe('query 2');
        expect(search.searchField.value).toBe('query 2');
    });
});
