import { URLARG_TYPE_ORDERED_STRING_ARRAY } from '../UrlArgTypes';

describe('URL arg type ordered string array', () => {
    const typeDef = URLARG_TYPE_ORDERED_STRING_ARRAY;
    const parser = typeDef.getParser('test');

    it('should be able to format basic values', () => {
        expect(typeDef.format(['a', 'b', 'c'])).toBe('a,b,c');
    });

    it('should be able to parse basic values', () => {
        expect(parser('a,b,c')).toEqual(['a', 'b', 'c']);
    });

    it('should return the equal array instance on subsequent calls with the same string', () => {
        const v1 = parser('a,b,c');
        const v2 = parser('a,b,c');
        expect(v1).toEqual(v2);
    });

    it('should return the equal array instance on subsequent calls with the same string for the same param', () => {
        const v1 = typeDef.getParser('test')('a,b,c');
        const v2 = typeDef.getParser('test')('a,b,c');
        expect(v1).toEqual(v2);
    });

    it('should return the not equal array if order changes', () => {
        const v1 = typeDef.getParser('test')('a,b,c');
        const v2 = typeDef.getParser('x')('a,b,c');
        expect(v1).toEqual(v2);
    });

    it('should return the same array instance on subsequent calls with the same string for the different params', () => {
        const v1 = typeDef.getParser('test')('a,b,c');
        const v2 = typeDef.getParser('x')('a,b,c');
        expect(v1).toEqual(v2);
    });

    it('should consider the order of elements', () => {
        expect(typeDef.isEqual(['a', 'b'], ['b', 'a'])).toBeFalsy();
    });
});
