import { expandT, setTFunction, t, translateDefault } from '../i18n';

describe('expandT', function() {
    it('should return original string', function() {
        expect(expandT('foo bar')).toBe('foo bar');
    });
    it('should expand simple variables', function() {
        expect(expandT('{{foo}} {{bar}}', { foo: 'A Foo' })).toBe('A Foo ');
    });
    it('should expand null and undefined as empty string', function() {
        expect(expandT('{{foo}}-{{bar}}', { foo: null, bar: undefined })).toBe('-');
    });
    it('should expand nested values', function() {
        expect(
            expandT('{{foo.bar.baz}}={{foo.bar.hallo}}', { foo: { bar: { baz: 'answer', hallo: 42 } }, bar: undefined })
        ).toBe('answer=42');
    });
    it('should expand simple values', function() {
        expect(expandT('{{name}}, {{_id}}', { name: 'Name', _id: 'ID' })).toBe('Name, ID');
    });
    it('should deal with empty options', function() {
        expect(expandT('{{foo.bar.baz}}-{{foo.bar.hallo}}')).toBe('-');
    });
});

describe('setTFunction', function() {
    afterEach(function() {
        setTFunction(translateDefault);
    });
    it('should call registered function', function() {
        const tFunction = jest.fn();
        setTFunction(tFunction);
        t('name', 'Michael');
        expect(tFunction).toBeCalledWith('name', 'Michael', undefined);
    });
    it('should call registered function', function() {
        const consoleErr = jest.spyOn(console, 'error');
        consoleErr.mockImplementation(() => {});

        const tFunction = jest.fn().mockImplementation(() => {
            throw Error('Somthing went wrong');
        });

        setTFunction(tFunction);
        t('name', 'Michael');
        expect(tFunction).toBeCalledWith('name', 'Michael', undefined);
        expect(consoleErr).toHaveBeenCalled();
        consoleErr.mockRestore();
    });
});
