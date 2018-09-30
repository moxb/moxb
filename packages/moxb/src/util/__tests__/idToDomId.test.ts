import { idToDomId } from '../..';

describe('idToDomId', function() {
    it('should return empty string if id is empty', function() {
        expect(idToDomId('')).toBe('');
    });
    it('should return empty string if id is null or undefined', function() {
        expect(idToDomId(null)).toBe('');
        expect(idToDomId(undefined)).toBe('');
    });
    it('should convert camel case to lowercase underscore', function() {
        expect(idToDomId('TheId')).toBe('the_id');
        expect(idToDomId('TheIDBar')).toBe('the_idbar');
        expect(idToDomId('notIBM')).toBe('not_ibm');
    });
    it('should prepend `x` if first character is not word', function() {
        expect(idToDomId('3xxx')).toBe('xxx');
        expect(idToDomId('_a')).toBe('a');
    });
    it('should replace non word or number or `-` to `-`', function() {
        expect(idToDomId('*-fo(ba^5$3BaX')).toBe('fo-ba-5-3_ba_x');
    });
    it('should not allow double -', function() {
        expect(idToDomId('---a*-*--*b()----c------d')).toBe('a-b-c-d');
    });
    it('should not allow _ or - at beginning', function() {
        expect(idToDomId('_x')).toBe('x');
        expect(idToDomId('-x')).toBe('x');
        expect(idToDomId('-__-x')).toBe('x');
        expect(idToDomId('Foo')).toBe('foo');
    });
    it('should not allow _ or - at end', function() {
        expect(idToDomId('x_')).toBe('x');
        expect(idToDomId('x-')).toBe('x');
    });
    it('should not allow _- or -_', function() {
        expect(idToDomId('foo_--bar-__baz')).toBe('foo-bar-baz');
    });
});
