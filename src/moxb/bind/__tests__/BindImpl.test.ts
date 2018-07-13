import { setTFunction, t, translateKeysDefault, translateKeysOnly } from '../../i18n/i18n';
import { Bind } from '../Bind';
import { BindImpl, BindOptions, getValueFromStringOrFunction, idToDomId } from '../BindImpl';

describe('interface Bind', function() {
    function newBind(options: BindOptions) {
        return new BindImpl(options);
    }
    describe('id', function() {
        it('should throw if empty', function() {
            expect(() => {
                newBind({
                    id: '',
                });
            }).toThrow();
        });

        it('should throw if `.`', function() {
            expect(() => {
                newBind({
                    id: '.',
                });
            }).toThrow();
        });

        it('should throw if not id', function() {
            expect(() => {
                newBind({
                    id: 'foo-bar',
                });
            }).toThrow();
        });
    });

    describe('domId', function() {
        it('should be lowercase with underscores', function() {
            const bind: Bind = newBind({
                id: 'FooBar',
            });
            expect(bind.domId).toBe('foo_bar');
        });

        it('should convert `.` to `-`', function() {
            const bind: Bind = newBind({
                id: 'foo.bar',
            });
            expect(bind.domId).toBe('foo-bar');
        });
    });

    describe('label', function() {
        beforeEach(function() {
            setTFunction(translateKeysDefault);
        });

        it('should be undefined by default', function() {
            expect(t('key', 'The Default')).toBe('[key] The Default');
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.domId).toBe('test');
            expect(bind.label).toBeUndefined();
        });
        it('should be translated', function() {
            const bind: Bind = newBind({
                id: 'test',
                label: 'Default String',
            });
            expect(bind.label).toBe('[test.label] Default String');
        });
        it('should be updated when translation changes', function() {
            const bind: Bind = newBind({
                id: 'test',
                label: 'Default String',
            });
            setTFunction(translateKeysOnly);
            expect(bind.label).toBe('[test.label]');
        });
        it('should take a function', function() {
            const label = jest.fn().mockReturnValue('The Translated String');
            const bind: Bind = newBind({
                id: 'test',
                label,
            });
            setTFunction(translateKeysOnly);
            expect(bind.label).toBe('The Translated String');
        });
        it('should take a function that returns undefined', function() {
            const label = jest.fn().mockReturnValue(undefined);
            const bind: Bind = newBind({
                id: 'test',
                label,
            });
            setTFunction(translateKeysOnly);
            expect(bind.label).toBeUndefined();
        });
        it('should have the BindImpl as `this`', function() {
            let theThis: any = undefined;
            const label = jest.fn().mockImplementation(function(this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                label,
            });
            bind.label;
            expect(theThis).toBe(bind);
        });
    });

    describe('disabled', function() {
        it('should be false by default', function() {
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.disabled).toBe(false);
        });
        it('should return false or the result of the disabled function', function() {
            const disabled = jest
                .fn()
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce('')
                .mockReturnValueOnce('x')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(1);
            const bind: Bind = newBind({
                id: 'test',
                disabled,
            });
            expect(bind.disabled).toBe(false); // undefined
            expect(bind.disabled).toBe(false); // false
            expect(bind.disabled).toBe(false); // null
            expect(bind.disabled).toBe(true); // true
            expect(bind.disabled).toBe(false); // ''
            expect(bind.disabled).toBe(true); // 'x'
            expect(bind.disabled).toBe(false); // 0
            expect(bind.disabled).toBe(true); // 1
        });
        it('should be not enabled', function() {
            const enabled = jest
                .fn()
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce('')
                .mockReturnValueOnce('x')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(1);
            const bind: Bind = newBind({
                id: 'test',
                enabled,
            });
            expect(bind.disabled).toBe(true); // undefined
            expect(bind.disabled).toBe(true); // false
            expect(bind.disabled).toBe(true); // null
            expect(bind.disabled).toBe(false); // true
            expect(bind.disabled).toBe(true); // ''
            expect(bind.disabled).toBe(false); // 'x'
            expect(bind.disabled).toBe(true); // 0
            expect(bind.disabled).toBe(false); // 1
        });
        it('should have the BindImpl as `this`', function() {
            let theThis: any = undefined;
            const disabled = jest.fn().mockImplementation(function(this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                disabled,
            });
            bind.disabled;
            expect(theThis).toBe(bind);
        });
    });
    describe('enabled', function() {
        it('should be true by default', function() {
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.enabled).toBe(true);
        });
        it('should be false by default', function() {
            const enabled = jest
                .fn()
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce('')
                .mockReturnValueOnce('x')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(1);
            const bind: Bind = newBind({
                id: 'test',
                enabled,
            });
            expect(bind.enabled).toBe(false); // undefined
            expect(bind.enabled).toBe(false); // false
            expect(bind.enabled).toBe(false); // null
            expect(bind.enabled).toBe(true); // true
            expect(bind.enabled).toBe(false); // ''
            expect(bind.enabled).toBe(true); // 'x'
            expect(bind.enabled).toBe(false); // 0
            expect(bind.enabled).toBe(true); // 1
        });
        it('should take the value as falsly/truly', function() {
            const enabled = jest
                .fn()
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce('')
                .mockReturnValueOnce('x')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(1);
            const bind: Bind = newBind({
                id: 'test',
                enabled,
            });
            expect(bind.enabled).toBe(false); // undefined
            expect(bind.enabled).toBe(false); // false
            expect(bind.enabled).toBe(false); // null
            expect(bind.enabled).toBe(true); // true
            expect(bind.enabled).toBe(false); // ''
            expect(bind.enabled).toBe(true); // 'x'
            expect(bind.enabled).toBe(false); // 0
            expect(bind.enabled).toBe(true); // 1
        });
        it('should be not disabled', function() {
            const disabled = jest
                .fn()
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce('')
                .mockReturnValueOnce('x')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(1);
            const bind: Bind = newBind({
                id: 'test',
                disabled,
            });
            expect(bind.enabled).toBe(true); // undefined
            expect(bind.enabled).toBe(true); // false
            expect(bind.enabled).toBe(true); // null
            expect(bind.enabled).toBe(false); // true
            expect(bind.enabled).toBe(true); // ''
            expect(bind.enabled).toBe(false); // 'x'
            expect(bind.enabled).toBe(true); // 0
            expect(bind.enabled).toBe(false); // 1
        });
        it('should not be possible to specify enabled and disabled', function() {
            expect(() =>
                newBind({
                    id: 'test',
                    disabled: jest.fn(),
                    enabled: jest.fn(),
                })
            ).toThrow();
        });
        it('should have the BindImpl as `this`', function() {
            let theThis: any = undefined;
            const enabled = jest.fn().mockImplementation(function(this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                enabled,
            });
            bind.disabled;
            expect(theThis).toBe(bind);
        });
    });

    describe('readOnly', function() {
        it('should be false by default', function() {
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.readOnly).toBe(false);
        });
        it('should return false or the result of the readOnly function', function() {
            const readOnly = jest
                .fn()
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce('')
                .mockReturnValueOnce('x')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(1);
            const bind: Bind = newBind({
                id: 'test',
                readOnly: readOnly,
            });
            expect(bind.readOnly).toBe(false); // undefined
            expect(bind.readOnly).toBe(false); // false
            expect(bind.readOnly).toBe(false); // null
            expect(bind.readOnly).toBe(true); // true
            expect(bind.readOnly).toBe(false); // ''
            expect(bind.readOnly).toBe(true); // 'x'
            expect(bind.readOnly).toBe(false); // 0
            expect(bind.readOnly).toBe(true); // 1
        });
        it('should have the BindImpl as `this`', function() {
            let theThis: any = undefined;
            const readOnly = jest.fn().mockImplementation(function(this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                readOnly,
            });
            bind.readOnly;
            expect(theThis).toBe(bind);
        });
    });

    describe('invisible', function() {
        it('should be false by default', function() {
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.invisible).toBe(false);
        });
        it('should return false or the result of the invisible function', function() {
            const invisible = jest
                .fn()
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce('')
                .mockReturnValueOnce('x')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(1);
            const bind: Bind = newBind({
                id: 'test',
                invisible: invisible,
            });
            expect(bind.invisible).toBe(false); // undefined
            expect(bind.invisible).toBe(false); // false
            expect(bind.invisible).toBe(false); // null
            expect(bind.invisible).toBe(true); // true
            expect(bind.invisible).toBe(false); // ''
            expect(bind.invisible).toBe(true); // 'x'
            expect(bind.invisible).toBe(false); // 0
            expect(bind.invisible).toBe(true); // 1
        });
        it('should have the BindImpl as `this`', function() {
            let theThis: any = undefined;
            const invisible = jest.fn().mockImplementation(function(this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                invisible,
            });
            bind.invisible;
            expect(theThis).toBe(bind);
        });
    });

    describe('help', function() {
        beforeEach(function() {
            setTFunction(translateKeysDefault);
        });

        it('should be undefined by default', function() {
            expect(t('key', 'The Default')).toBe('[key] The Default');
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.domId).toBe('test');
            expect(bind.help).toBeUndefined();
        });
        it('should be translated', function() {
            const bind: Bind = newBind({
                id: 'test',
                help: 'Default String',
            });
            expect(bind.help).toBe('[test.help] Default String');
        });
        it('should be updated when translation changes', function() {
            const bind: Bind = newBind({
                id: 'test',
                help: 'Default String',
            });
            setTFunction(translateKeysOnly);
            expect(bind.help).toBe('[test.help]');
        });
        it('should take a function', function() {
            const help = jest.fn().mockReturnValue('The Translated String');
            const bind: Bind = newBind({
                id: 'test',
                help,
            });
            setTFunction(translateKeysOnly);
            expect(bind.help).toBe('The Translated String');
        });
        it('should take a function that returns undefined', function() {
            const help = jest.fn().mockReturnValue(undefined);
            const bind: Bind = newBind({
                id: 'test',
                help,
            });
            setTFunction(translateKeysOnly);
            expect(bind.help).toBeUndefined();
        });

        it('should have the BindImpl as `this`', function() {
            let theThis: any = undefined;
            const help = jest.fn().mockImplementation(function(this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                help,
            });
            bind.help;
            expect(theThis).toBe(bind);
        });
    });

    describe('error', function() {
        beforeEach(function() {
            setTFunction(translateKeysDefault);
        });

        it('should be undefined by default', function() {
            expect(t('key', 'The Default')).toBe('[key] The Default');
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.domId).toBe('test');
            expect(bind.error).toBeUndefined();
        });
        it('should not be translated', function() {
            const bind: Bind = newBind({
                id: 'test',
                getError: jest.fn().mockReturnValue('The Error'),
            });
            expect(bind.error).toBe('The Error');
        });

        it('should have the BindImpl as `this`', function() {
            let theThis: any = undefined;
            const getError = jest.fn().mockImplementation(function(this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                getError,
            });
            bind.error;
            expect(theThis).toBe(bind);
        });
    });

    describe('setError()', function() {
        it('should be called', function() {
            const setError = jest.fn();
            const bind: Bind = newBind({
                id: 'test',
                setError,
            });
            bind.setError('foo');

            expect(setError).toHaveBeenCalledWith('foo');
        });

        it('should have the BindImpl as `this`', function() {
            let theThis: any = undefined;
            const setError = jest.fn().mockImplementation(function(this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                setError,
            });
            bind.setError('bar');
            expect(theThis).toBe(bind);
        });
    });

    describe('clearError', function() {
        it('should be called', function() {
            const clearError = jest.fn();
            const bind: Bind = newBind({
                id: 'test',
                clearError,
            });
            bind.clearError();

            expect(clearError).toHaveBeenCalledTimes(1);
            bind.clearError();
            expect(clearError).toHaveBeenCalledTimes(2);
        });

        it('should clear error', function() {
            const bind: Bind = newBind({
                id: 'test',
            });
            bind.setError('something is wrong');
            bind.clearError();
            expect(bind.error).toBeUndefined();
        });

        it('should have the BindImpl as `this`', function() {
            let theThis: any = undefined;
            const clearError = jest.fn().mockImplementation(function(this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                clearError,
            });
            bind.clearError();
            expect(theThis).toBe(bind);
        });
    });

    describe('validateField', function() {
        it('should be called', function() {
            const validateField = jest.fn();
            const bind: Bind = newBind({
                id: 'test',
                validateField,
            });
            bind.validateField();

            expect(validateField).toHaveBeenCalledTimes(1);
            bind.validateField();
            expect(validateField).toHaveBeenCalledTimes(2);
        });

        it('should have the BindImpl as `this`', function() {
            let theThis: any = undefined;
            const validateField = jest.fn().mockImplementation(function(this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                validateField,
            });
            bind.validateField();
            expect(theThis).toBe(bind);
        });
    });

    describe('getValueFromStringOrFunction', function() {
        it('a string should return the string', function() {
            expect(getValueFromStringOrFunction('foo')).toBe('foo');
        });
        it('undefined should return string', function() {
            expect(getValueFromStringOrFunction(undefined)).toBeUndefined();
        });
        it('should return the result of the function', function() {
            expect(getValueFromStringOrFunction(() => 'bar')).toBe('bar');
        });
        it('should return null', function() {
            expect(getValueFromStringOrFunction(() => undefined)).toBeUndefined();
        });
    });
});

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
