import {
    setTFunction,
    t,
    translateKeysDefault,
    translateKeysOnly,
    decideRefuse,
    getValueFromStringOrFunction,
} from '@moxb/util';
import { Bind } from '../Bind';
import { BindImpl, BindOptions } from '../BindImpl';

describe('interface Bind', function () {
    function newBind(options: BindOptions) {
        return new BindImpl(options);
    }

    describe('id', function () {
        it('should throw if empty', function () {
            expect(() => {
                newBind({
                    id: '',
                });
            }).toThrow();
        });

        it('should throw if `.`', function () {
            expect(() => {
                newBind({
                    id: '.',
                });
            }).toThrow();
        });

        it('should throw if not id', function () {
            expect(() => {
                newBind({
                    id: 'foo-bar',
                });
            }).toThrow();
        });
    });

    describe('domId', function () {
        it('should be lowercase with underscores', function () {
            const bind: Bind = newBind({
                id: 'FooBar',
            });
            expect(bind.domId).toBe('foo_bar');
        });

        it('should convert `.` to `-`', function () {
            const bind: Bind = newBind({
                id: 'foo.bar',
            });
            expect(bind.domId).toBe('foo-bar');
        });
    });

    describe('label', function () {
        beforeEach(function () {
            setTFunction(translateKeysDefault);
        });

        it('should be undefined by default', function () {
            expect(t('key', 'The Default')).toBe('[key] The Default');
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.domId).toBe('test');
            expect(bind.label).toBeUndefined();
        });
        it('should be translated', function () {
            const bind: Bind = newBind({
                id: 'test',
                label: 'Default String',
            });
            expect(bind.label).toBe('[test.label] Default String');
        });
        it('should be updated when translation changes', function () {
            const bind: Bind = newBind({
                id: 'test',
                label: 'Default String',
            });
            setTFunction(translateKeysOnly);
            expect(bind.label).toBe('[test.label]');
        });
        it('should take a function', function () {
            const label = jest.fn().mockReturnValue('The Translated String');
            const bind: Bind = newBind({
                id: 'test',
                label,
            });
            setTFunction(translateKeysOnly);
            expect(bind.label).toBe('The Translated String');
        });
        it('should take a function that returns undefined', function () {
            const label = jest.fn().mockReturnValue(undefined);
            const bind: Bind = newBind({
                id: 'test',
                label,
            });
            setTFunction(translateKeysOnly);
            expect(bind.label).toBeUndefined();
        });
        it('should have the BindImpl as `this`', function () {
            let theThis: any = undefined;
            const label = jest.fn().mockImplementation(function (this: any) {
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

    describe('disabled', function () {
        it('should be false by default', function () {
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.disabled).toBe(false);
        });
        it('should return true or the result of the disabled function', function () {
            function testDisabledTrue(value: any) {
                const disabled = jest.fn().mockReturnValue(value);
                const bind: Bind = newBind({
                    id: 'test',
                    disabled,
                });
                expect(bind.disabled).toBe(true);
            }

            testDisabledTrue(true);
            testDisabledTrue('x');
            testDisabledTrue(1);
        });
        it('should return true or the result of the disabled function', function () {
            function testDisabledFalse(value: any) {
                const disabled = jest.fn().mockReturnValue(value);
                const bind: Bind = newBind({
                    id: 'test',
                    disabled,
                });
                expect(bind.disabled).toBe(false);
            }

            testDisabledFalse(undefined);
            testDisabledFalse(false);
            testDisabledFalse(null);
            testDisabledFalse('');
            testDisabledFalse(0);
            testDisabledFalse(decideRefuse());
            testDisabledFalse(decideRefuse('why now'));
        });
        it('should be not enabled', function () {
            function testDisabledFalse(value: any) {
                const enabled = jest.fn().mockReturnValue(value);
                const bind: Bind = newBind({
                    id: 'test',
                    enabled,
                });
                expect(bind.disabled).toBe(false);
            }

            function testDisabledTrue(value: any) {
                const enabled = jest.fn().mockReturnValue(value);
                const bind: Bind = newBind({
                    id: 'test',
                    enabled,
                });
                expect(bind.disabled).toBe(true);
            }

            testDisabledFalse(true);
            testDisabledFalse('x');
            testDisabledFalse(1);
            testDisabledTrue(undefined);
            testDisabledTrue(false);
            testDisabledTrue(null);
            testDisabledTrue('');
            testDisabledTrue(0);
            testDisabledTrue(decideRefuse());
            testDisabledTrue(decideRefuse('i do not like it'));
        });
        it('should have the BindImpl as `this`', function () {
            let theThis: any = undefined;
            const disabled = jest.fn().mockImplementation(function (this: any) {
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

    describe('reason', function () {
        it('should be undefined by default', function () {
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.reason).toBeUndefined();
        });
        it('should return the reason provided by disabled function', function () {
            function testReasonWhenDisabled(reason?: string) {
                const disabled = jest.fn().mockReturnValue(decideRefuse(reason));
                const bind: Bind = newBind({
                    id: 'test',
                    disabled,
                });
                expect(bind.reason).toBe(reason);
            }

            testReasonWhenDisabled('Becase we can');
            testReasonWhenDisabled();
        });
    });

    describe('enabled', function () {
        it('should be true by default', function () {
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.enabled).toBe(true);
        });
        it('should be false by default', function () {
            function testEnabledToDisabled(value: any, expected: boolean) {
                const enabled = jest.fn().mockReturnValue(value);
                const bind: Bind = newBind({
                    id: 'test',
                    enabled,
                });
                expect(bind.disabled).toBe(expected);
            }

            testEnabledToDisabled(undefined, true);
            testEnabledToDisabled(false, true);
            testEnabledToDisabled(null, true);
            testEnabledToDisabled('', true);
            testEnabledToDisabled(0, true);

            testEnabledToDisabled(true, false);
            testEnabledToDisabled('x', false);
            testEnabledToDisabled(1, false);
        });
        it('should take the value as falsly/truly', function () {
            function testEnabled(value: any, expected: boolean) {
                const enabled = jest.fn().mockReturnValue(value);
                const bind: Bind = newBind({
                    id: 'test',
                    enabled,
                });
                expect(bind.enabled).toBe(expected);
            }

            testEnabled(undefined, false);
            testEnabled(false, false);
            testEnabled(null, false);
            testEnabled('', false);
            testEnabled(0, false);

            testEnabled(true, true);
            testEnabled('x', true);
            testEnabled(1, true);
        });
        it('should be not disabled', function () {
            function testDisabledToEnabled(value: any, expected: boolean) {
                const disabled = jest.fn().mockReturnValue(value);
                const bind: Bind = newBind({
                    id: 'test',
                    disabled,
                });
                expect(bind.enabled).toBe(expected);
            }

            testDisabledToEnabled(undefined, true);
            testDisabledToEnabled(false, true);
            testDisabledToEnabled(null, true);
            testDisabledToEnabled('', true);
            testDisabledToEnabled(0, true);

            testDisabledToEnabled(true, false);
            testDisabledToEnabled('x', false);
            testDisabledToEnabled(1, false);
        });
        it('should not be possible to specify enabled and disabled', function () {
            expect(() =>
                newBind({
                    id: 'test',
                    disabled: jest.fn(),
                    enabled: jest.fn(),
                })
            ).toThrow();
        });
        it('should have the BindImpl as `this`', function () {
            let theThis: any = undefined;
            const enabled = jest.fn().mockImplementation(function (this: any) {
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

    describe('readOnly', function () {
        it('should be false by default', function () {
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.readOnly).toBe(false);
        });
        it('should return false or the result of the readOnly function', function () {
            function testReadOnly(value: any, expected: boolean) {
                const readOnly = jest.fn().mockReturnValue(value);
                const bind: Bind = newBind({
                    id: 'test',
                    readOnly,
                });
                expect(bind.readOnly).toBe(expected);
            }

            testReadOnly(undefined, false);
            testReadOnly(false, false);
            testReadOnly(null, false);
            testReadOnly('', false);
            testReadOnly(0, false);

            testReadOnly(true, true);
            testReadOnly('x', true);
            testReadOnly(1, true);
        });
        it('should have the BindImpl as `this`', function () {
            let theThis: any = undefined;
            const readOnly = jest.fn().mockImplementation(function (this: any) {
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

    describe('invisible', function () {
        it('should be false by default', function () {
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.invisible).toBe(false);
        });
        it('should return false or the result of the invisible function', function () {
            function testInvidible(value: any, expected: boolean) {
                const invisible = jest.fn().mockReturnValue(value);
                const bind: Bind = newBind({
                    id: 'test',
                    invisible,
                });
                expect(bind.invisible).toBe(expected);
            }

            testInvidible(undefined, false);
            testInvidible(false, false);
            testInvidible(null, false);
            testInvidible('', false);
            testInvidible(0, false);

            testInvidible(true, true);
            testInvidible('x', true);
            testInvidible(1, true);
        });
        it('should have the BindImpl as `this`', function () {
            let theThis: any = undefined;
            const invisible = jest.fn().mockImplementation(function (this: any) {
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

    describe('help', function () {
        beforeEach(function () {
            setTFunction(translateKeysDefault);
        });

        it('should be undefined by default', function () {
            expect(t('key', 'The Default')).toBe('[key] The Default');
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.domId).toBe('test');
            expect(bind.help).toBeUndefined();
        });
        it('should be translated', function () {
            const bind: Bind = newBind({
                id: 'test',
                help: 'Default String',
            });
            expect(bind.help).toBe('[test.help] Default String');
        });
        it('should be updated when translation changes', function () {
            const bind: Bind = newBind({
                id: 'test',
                help: 'Default String',
            });
            setTFunction(translateKeysOnly);
            expect(bind.help).toBe('[test.help]');
        });
        it('should take a function', function () {
            const help = jest.fn().mockReturnValue('The Translated String');
            const bind: Bind = newBind({
                id: 'test',
                help,
            });
            setTFunction(translateKeysOnly);
            expect(bind.help).toBe('The Translated String');
        });
        it('should take a function that returns undefined', function () {
            const help = jest.fn().mockReturnValue(undefined);
            const bind: Bind = newBind({
                id: 'test',
                help,
            });
            setTFunction(translateKeysOnly);
            expect(bind.help).toBeUndefined();
        });

        it('should have the BindImpl as `this`', function () {
            let theThis: any = undefined;
            const help = jest.fn().mockImplementation(function (this: any) {
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

    describe('errors', function () {
        beforeEach(function () {
            setTFunction(translateKeysDefault);
        });

        it('should be an empty array by default', function () {
            expect(t('key', 'The Default')).toBe('[key] The Default');
            const bind: Bind = newBind({
                id: 'test',
            });
            expect(bind.domId).toBe('test');
            expect(bind.errors).toEqual([]);
            expect(bind.hasErrors).toEqual(false);
        });
        it('should not be translated', function () {
            const bind: Bind = newBind({
                id: 'test',
                getErrors: jest.fn().mockReturnValue(['The Error']),
            });
            expect(bind.errors).toEqual(['The Error']);
            expect(bind.hasErrors).toEqual(true);
        });

        it('should not show duplicates when getError returns multiple errors', function () {
            const bind: Bind = newBind({
                id: 'test',
                getErrors: jest.fn().mockReturnValue(['Error 1', 'Error 1', 'Error 2', 'Error 1']),
            });
            expect(bind.errors).toEqual(['Error 1', 'Error 2']);
            expect(bind.hasErrors).toEqual(true);
        });

        it('should not show duplicates when multiple setError is called', function () {
            const bind: Bind = newBind({
                id: 'test',
            });
            bind.setError('Error 1');
            bind.setError('Error 2');
            bind.setError('Error 1');
            expect(bind.errors).toEqual(['Error 1', 'Error 2']);
            expect(bind.hasErrors).toEqual(true);
        });

        it('should not show duplicates when multiple setError is called and getErrors returns errors', function () {
            const bind: Bind = newBind({
                id: 'test',
                getErrors: jest
                    .fn()
                    .mockReturnValue(['Error 1', 'Error 1', 'Error 2', 'Error 1', 'Only Function Error']),
            });
            bind.setError('Error 1');
            bind.setError('Error 2');
            bind.setError('Error 1');
            bind.setError('Set Error 1');
            expect(bind.errors).toEqual(['Error 1', 'Error 2', 'Only Function Error', 'Set Error 1']);
            expect(bind.hasErrors).toEqual(true);
        });

        it('should have the BindImpl as `this`', function () {
            let theThis: any = undefined;
            const getErrors = jest.fn().mockImplementation(function (this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                getErrors,
            });
            bind.errors;
            expect(theThis).toBe(bind);
        });
    });

    describe('setError()', function () {
        it('should be called', function () {
            const setError = jest.fn();
            const bind: Bind = newBind({
                id: 'test',
                setError,
            });
            bind.setError('foo');

            expect(setError).toHaveBeenCalledWith('foo');
        });

        it('should have the BindImpl as `this`', function () {
            let theThis: any = undefined;
            const setError = jest.fn().mockImplementation(function (this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                setError,
            });
            bind.setError('bar');
            expect(theThis).toBe(bind);
        });

        it('should store all error in the errors array', function () {
            const bind: Bind = newBind({
                id: 'test',
            });
            bind.setError('foo');
            bind.setError('bar');
            expect(bind.errors).toEqual(['foo', 'bar']);
            expect(bind.hasErrors).toEqual(true);
        });
    });

    describe('clearErrors', function () {
        it('should be called', function () {
            const clearErrors = jest.fn();
            const bind: Bind = newBind({
                id: 'test',
                clearErrors,
            });
            bind.clearErrors();

            expect(clearErrors).toHaveBeenCalledTimes(1);
            bind.clearErrors();
            expect(clearErrors).toHaveBeenCalledTimes(2);
        });

        it('should clear error', function () {
            const bind: Bind = newBind({
                id: 'test',
            });
            bind.setError('something is wrong');
            bind.clearErrors();
            expect(bind.errors).toEqual([]);
            expect(bind.hasErrors).toEqual(false);
        });

        it('should have the BindImpl as `this`', function () {
            let theThis: any = undefined;
            const clearErrors = jest.fn().mockImplementation(function (this: any) {
                theThis = this;
            });
            const bind: Bind = newBind({
                id: 'test',
                clearErrors,
            });
            bind.clearErrors();
            expect(theThis).toBe(bind);
        });
    });

    describe('validateField', function () {
        it('should be called', function () {
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

        it('should have the BindImpl as `this`', function () {
            let theThis: any = undefined;
            const validateField = jest.fn().mockImplementation(function (this: any) {
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

    describe('getValueFromStringOrFunction', function () {
        it('a string should return the string', function () {
            expect(getValueFromStringOrFunction('foo')).toBe('foo');
        });
        it('undefined should return string', function () {
            expect(getValueFromStringOrFunction(undefined)).toBeUndefined();
        });
        it('should return the result of the function', function () {
            expect(getValueFromStringOrFunction(() => 'bar')).toBe('bar');
        });
        it('should return null', function () {
            expect(getValueFromStringOrFunction(() => undefined)).toBeUndefined();
        });
    });
});
