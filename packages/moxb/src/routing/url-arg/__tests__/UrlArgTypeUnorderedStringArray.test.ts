import { URLARG_TYPE_UNORDERED_STRING_ARRAY } from '../UrlArgTypes';

describe('URL arg type boolean', () => {
    const typeDef = URLARG_TYPE_UNORDERED_STRING_ARRAY;
    const parser = typeDef.getParser('test');

    it('should be able to format basic values', () => {
        expect(typeDef.format(['a', 'b', 'c'])).toBe('a,b,c');
    });

    it('should be able to parse basic values', () => {
        expect(parser('a,b,c', ['42'])).toEqual(['a', 'b', 'c']);
    });

    it('should return the same array instance on subsequent calls with the same string', () => {
        const v1 = parser('a,b,c', ['42']);
        const v2 = parser('a,b,c', ['42']);
        expect(v1).toBe(v2); // The objects are actually the same, not only equal!
    });

    it('should be able to parse empty strings', () => {
        expect(parser('', ['42'])).toEqual([]);
    });

    it('should ignore the order of elements', () => {
        expect(typeDef.isEqual(['a', 'b'], ['b', 'a'])).toBeTruthy();
    });
});
