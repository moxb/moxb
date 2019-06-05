import { QueryFilterImpl } from '../QueryFilterImpl';

class QueryString {
    constructor(private query: string = '') {}
    getQuery() {
        return this.query;
    }
    setQuery(query: string) {
        this.query = query;
    }
}

describe('QueryFilterImpl', function() {
    it('adds condition to queryString', function() {
        const filter = new QueryFilterImpl(new QueryString());
        expect(filter.queryString.getQuery()).toBe('');

        filter.addCondition({ type: 'equals', field: 'test.field', value: 'value with spaces' });
        expect(filter.queryString.getQuery()).toBe('test.field:"value with spaces"');

        filter.addCondition({ type: 'equals', field: 'field2', value: 'single-value' });
        expect(filter.queryString.getQuery()).toBe('test.field:"value with spaces" field2:single-value');
    });
    it('removes condition from queryString', function() {
        const filter = new QueryFilterImpl(new QueryString('f1:value1 f2:"value 2" f3:value3 f4:"value 4"'));
        expect(filter.queryString.getQuery()).toBe('f1:value1 f2:"value 2" f3:value3 f4:"value 4"');

        filter.removeCondition({ type: 'equals', field: 'not.exists', value: 'not-exists' });
        expect(filter.queryString.getQuery()).toBe('f1:value1 f2:"value 2" f3:value3 f4:"value 4"');

        filter.removeCondition({ type: 'equals', field: 'f1', value: 'not-exists' });
        expect(filter.queryString.getQuery()).toBe('f1:value1 f2:"value 2" f3:value3 f4:"value 4"');

        filter.removeCondition({ type: 'equals', field: 'f1', value: 'value1' });
        expect(filter.queryString.getQuery()).toBe('f2:"value 2" f3:value3 f4:"value 4"');

        filter.removeCondition({ type: 'equals', field: 'f3', value: 'value3' });
        expect(filter.queryString.getQuery()).toBe('f2:"value 2" f4:"value 4"');

        filter.removeCondition({ type: 'equals', field: 'f4', value: 'value 4' });
        expect(filter.queryString.getQuery()).toBe('f2:"value 2"');

        filter.removeCondition({ type: 'equals', field: 'f2', value: 'value 2' });
        expect(filter.queryString.getQuery()).toBe('');
    });
    it('toggles condition in queryString', function() {
        const filter = new QueryFilterImpl(new QueryString());
        expect(filter.queryString.getQuery()).toBe('');

        filter.toggleCondition({ type: 'equals', field: 'field.1', value: 'value 1' });
        expect(filter.queryString.getQuery()).toBe('field.1:"value 1"');

        filter.toggleCondition({ type: 'equals', field: 'field.1', value: 'value-1.1' });
        expect(filter.queryString.getQuery()).toBe('field.1:"value 1" field.1:value-1.1');

        filter.toggleCondition({ type: 'equals', field: 'field.2', value: 'value 2' });
        expect(filter.queryString.getQuery()).toBe('field.1:"value 1" field.1:value-1.1 field.2:"value 2"');

        filter.toggleCondition({ type: 'equals', field: 'field.3', value: 'value-3' });
        expect(filter.queryString.getQuery()).toBe(
            'field.1:"value 1" field.1:value-1.1 field.2:"value 2" field.3:value-3'
        );

        filter.toggleCondition({ type: 'equals', field: 'field.1', value: 'value 1' });
        expect(filter.queryString.getQuery()).toBe('field.1:value-1.1 field.2:"value 2" field.3:value-3');

        filter.toggleCondition({ type: 'equals', field: 'field.2', value: 'value 2' });
        expect(filter.queryString.getQuery()).toBe('field.1:value-1.1 field.3:value-3');

        filter.toggleCondition({ type: 'equals', field: 'field.3', value: 'value-3' });
        expect(filter.queryString.getQuery()).toBe('field.1:value-1.1');

        filter.toggleCondition({ type: 'equals', field: 'field.1', value: 'value-1.1' });
        expect(filter.queryString.getQuery()).toBe('');
    });
    it('computes if queryString includes condition', function() {
        const filter = new QueryFilterImpl(new QueryString('f1:value1 f2:"value 2" f3:value3'));
        expect(filter.queryString.getQuery()).toBe('f1:value1 f2:"value 2" f3:value3');

        expect(filter.hasCondition({ type: 'equals', field: 'f1', value: 'value1' })).toBe(true);
        expect(filter.hasCondition({ type: 'equals', field: 'f2', value: 'value 2' })).toBe(true);
        expect(filter.hasCondition({ type: 'equals', field: 'f3', value: 'value3' })).toBe(true);

        expect(filter.hasCondition({ type: 'equals', field: 'f1', value: 'value 1' })).toBe(false);
        expect(filter.hasCondition({ type: 'equals', field: 'f2', value: 'value2' })).toBe(false);
        expect(filter.hasCondition({ type: 'equals', field: 'f3', value: 'value 3' })).toBe(false);
        expect(filter.hasCondition({ type: 'equals', field: 'f4', value: 'value 1' })).toBe(false);
        expect(filter.hasCondition({ type: 'equals', field: 'f4', value: 'value1' })).toBe(false);
    });
});
