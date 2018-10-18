import { URLARG_TYPE_BOOLEAN } from '../UrlArgTypes';

describe('URL arg type boolean', () => {
    const typeDef = URLARG_TYPE_BOOLEAN;
    const parser = typeDef.getParser('test');

    it('should be able to format true', () => {
        expect(typeDef.format(true)).toBe('true');
    });

    it('should be able to format false', () => {
        expect(typeDef.format(false)).toBe('false');
    });

    it('should be able to parse true', () => {
        expect(parser('true', false)).toBe(true);
    });

    it('should be able to parse false', () => {
        expect(parser('false', false)).toBe(false);
    });

    it('should interpreted random junk as false', () => {
        expect(parser('magic', false)).toBe(false);
    });

    it('should correctly recognize true to be equal to true', () => {
        expect(typeDef.isEqual(true, true)).toBeTruthy();
    });

    it('should correctly recognize false to be equal to false', () => {
        expect(typeDef.isEqual(false, false)).toBeTruthy();
    });

    it('should correctly recognize false NOT to be equal to true', () => {
        expect(typeDef.isEqual(false, true)).toBeFalsy();
    });

    it('should correctly recognize true NOT to be equal to false', () => {
        expect(typeDef.isEqual(false, true)).toBeFalsy();
    });
});
