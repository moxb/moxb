import { URLARG_TYPE_ORDERED_STRING_ARRAY } from '../UrlArgTypes';

describe('URL arg type ordered string array', () => {
    const typeDef = URLARG_TYPE_ORDERED_STRING_ARRAY;
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

    it('should return the same array instance on subsequent calls with the same string for the same param', () => {
        const v1 = typeDef.getParser('test')('a,b,c', ['42']);
        const v2 = typeDef.getParser('test')('a,b,c', ['42']);
        expect(v1).toBe(v2); // The objects are actually the same, not only equal!
    });

    it('should return the same array instance on subsequent calls with the same string for the different params', () => {
        const v1 = typeDef.getParser('test')('a,b,c', ['42']);
        const v2 = typeDef.getParser('x')('a,b,c', ['42']);
        expect(v1).not.toBe(v2); // The objects are actually not the same
        expect(v1).toEqual(v2); // ...but equal!
    });

    it('should be able to parse empty strings', () => {
        expect(parser('', ['42'])).toEqual(['42']);
        const defaultValue = ['1'];
        expect(parser('', defaultValue)).toBe(defaultValue);
    });

    it('should consider the order of elements', () => {
        expect(typeDef.isEqual(['a', 'b'], ['b', 'a'])).toBeFalsy();
    });
});
