import { URLARG_TYPE_UNORDERED_STRING_ARRAY } from '../UrlArgTypes';

describe('URL arg type unordered string array', () => {
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
        expect(v1).toEqual(v2);
    });

    it('should return the same array instance on subsequent calls with the same string for the same param', () => {
        const v1 = typeDef.getParser('test')('a,b,c', ['42']);
        const v2 = typeDef.getParser('test')('a,b,c', ['42']);
        expect(v1).toEqual(v2);
    });

    it('should return the same array instance independent of order', () => {
        // To be consistent, this should also be the same not equal! (else we can drop the entire sameness)...
        const v1 = typeDef.getParser('test')('a,b,c', ['42']);
        const v2 = typeDef.getParser('test')('c,a,b', ['42']);
        expect(v1).toEqual(v2);
    });

    it('should return the same array instance on subsequent calls with the same string for the different params', () => {
        const v1 = typeDef.getParser('test')('a,b,c', ['42']);
        const v2 = typeDef.getParser('x')('a,b,c', ['42']);
        expect(v1).toEqual(v2);
    });

    it('should be able to parse empty strings', () => {
        expect(parser('', ['42'])).toEqual(['42']);
    });

    it('should return copy of default value', () => {
        const defaultValue = ['1', '2'];
        const v = parser('', defaultValue);
        expect(v).toEqual(defaultValue);
        expect(v).not.toBe(defaultValue);
    });

    it('should sort default value but not change it', () => {
        const defaultValue = ['z', 'a'];
        expect(parser('', defaultValue)).toEqual(['a', 'z']);
        expect(defaultValue).toEqual(['z', 'a']);
    });

    it('should ignore the order of elements', () => {
        expect(typeDef.isEqual(['a', 'b'], ['b', 'a'])).toBeTruthy();
    });
});
