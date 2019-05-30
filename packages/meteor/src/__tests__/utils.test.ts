import { getIn, isIn, setIn } from '../utils';

describe('getIn', function() {
    it('should get existing keys', function() {
        expect(getIn({ nested: { field: 'nested' } }, 'nested.field')).toBe('nested');
        expect(getIn({ nested: { field: false } }, 'nested.field')).toBe(false);
        expect(getIn({ shallowValue: 'shallow' }, 'shallowValue')).toBe('shallow');
        expect(getIn({ set: { to: { undefined: undefined } } }, 'set.to.undefined')).toBe(undefined);
    });
    it('should return undefined for non-existing keys', function() {
        expect(getIn({ nested: { field: 'nested' } }, 'not.existing')).toBe(undefined);
        expect(getIn('not an object', 'nested.field')).toBe(undefined);
    });
});

describe('isIn', function() {
    it('should return true for existing keys', function() {
        expect(isIn({ nested: { value: 'nested' } }, 'nested.value')).toBe(true);
        expect(isIn({ shallowValue: 0 }, 'shallowValue')).toBe(true);
        expect(isIn({ set: { to: { undefined: undefined } } }, 'set.to.undefined')).toBe(true);
    });

    it('should return false for non-existing keys', function() {
        expect(isIn({ nested: { value: 'nested' } }, 'nested.value2')).toBe(false);
        expect(isIn({ shallowValue: 0 }, 'notExisting')).toBe(false);
        expect(isIn({}, 'does.not.exist')).toBe(false);
    });
});

describe('setIn', function() {
    it('should set to expected value', function() {
        expect(setIn({ shallow: 'shallow1' }, 'shallow', 'shallow2')).toEqual({ shallow: 'shallow2' });
        expect(setIn({ nested: { value: 'nested1' } }, 'nested.value', 'nested2')).toEqual({
            nested: { value: 'nested2' },
        });
        expect(setIn({}, 'nested.value', 'nested2')).toEqual({ nested: { value: 'nested2' } });
        expect(setIn({ shallow: 'shallow', nested: { value: 'nested' } }, 'nested.value2', 'nested2')).toEqual({
            nested: { value: 'nested', value2: 'nested2' },
            shallow: 'shallow',
        });
    });
});
