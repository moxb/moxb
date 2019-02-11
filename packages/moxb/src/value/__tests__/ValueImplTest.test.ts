import { setTFunction, t, translateKeysDefault, translateKeysOnly } from '../../i18n/i18n';
import { Value } from '../Value';
import { ValueImpl, ValueOptions } from '../ValueImpl';

class ValueImplForTest<T> extends ValueImpl<ValueImplForTest<T>, T, ValueOptions<ValueImplForTest<T>, T>> {}

valueImplTestTest((options: ValueOptions<ValueImplForTest<string>, string>) => new ValueImplForTest(options));

function valueImplTestTest<T>(newBindValue: (opts: ValueOptions<ValueImplForTest<T>, string>) => Value<T>) {
    // helper function to to call the template -- that seems to be necessary fot
    // typescript to work...
    function bindStringValue(opts: ValueOptions<ValueImplForTest<string>, string>): Value<string> {
        return new ValueImplForTest(opts);
    }
    function bindStringValueOrNull(opts: ValueOptions<ValueImplForTest<string>, string | null>): Value<string | null> {
        return new ValueImplForTest(opts);
    }
    describe('interfce Value', function() {
        describe('placeholder', function() {
            beforeEach(function() {
                setTFunction(translateKeysDefault);
            });

            it('should be undefined by default', function() {
                expect(t('key', 'The Default')).toBe('[key] The Default');
                const bind: Value<T> = newBindValue({
                    id: 'test',
                });
                expect(bind.domId).toBe('test');
                expect(bind.placeholder).toBeUndefined();
            });

            it('should be translated', function() {
                const bind: Value<T> = newBindValue({
                    id: 'test',
                    placeholder: 'Default String',
                });
                expect(bind.placeholder).toBe('[test.placeholder] Default String');
            });

            it('should be updated when translation changes', function() {
                const bind: Value<T> = newBindValue({
                    id: 'test',
                    placeholder: 'Default String',
                });
                setTFunction(translateKeysOnly);
                expect(bind.placeholder).toBe('[test.placeholder]');
            });

            it('should take a function', function() {
                const placeholder = jest.fn().mockReturnValue('The Translated String');
                const bind: Value<T> = newBindValue({
                    id: 'test',
                    placeholder,
                });
                setTFunction(translateKeysOnly);
                expect(bind.placeholder).toBe('The Translated String');
            });

            it('should take a function that returns undefined', function() {
                const placeholder = jest.fn().mockReturnValue(undefined);
                const bind: Value<T> = newBindValue({
                    id: 'test',
                    placeholder,
                });
                setTFunction(translateKeysOnly);
                expect(bind.placeholder).toBeUndefined();
            });

            it('should have ValueImpl as `this`', function() {
                let theThis: any = undefined;
                const placeholder = jest.fn().mockImplementation(function(this: any) {
                    theThis = this;
                });
                const bind: Value<T> = newBindValue({
                    id: 'test',
                    placeholder,
                });
                bind.placeholder;
                expect(theThis).toBe(bind);
            });
        });

        describe('inputType', function() {
            it('should be undefined initially', function() {
                const bind: Value<T> = newBindValue({
                    id: 'test',
                });
                expect(bind.inputType).toBeUndefined();
            });

            it('should be settable', function() {
                const bind: Value<T> = newBindValue({
                    id: 'test',
                    inputType: 'string',
                });
                expect(bind.inputType).toBe('string');
            });
        });

        describe('value', function() {
            it('should be undefined initially', function() {
                const bind: Value<T> = newBindValue({
                    id: 'test',
                });
                expect(bind.value).toBeUndefined();
            });

            describe('initialValue', function() {
                it('should be the same as the default value', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        initialValue: 'foo',
                    });
                    expect(bind.value).toBe('foo');
                    bind.setValue('bar');
                    expect(bind.value).toBe('bar');
                });

                it('should be the same as set value', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        initialValue: 'foo',
                    });
                    bind.setValue('bar');
                    expect(bind.value).toBe('bar');
                });
            });

            describe('initialValue()', function() {
                it('should be the same as the default value', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        initialValue: () => 'foo',
                    });
                    expect(bind.value).toBe('foo');
                    bind.setValue('bar');
                    expect(bind.value).toBe('bar');
                });

                it('should be the same as set value', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        initialValue: () => 'foo',
                    });
                    bind.setValue('bar');
                    expect(bind.value).toBe('bar');
                });

                it('should have ValueImpl as `this`', function() {
                    let theThis: any = undefined;
                    const initialValue = jest.fn().mockImplementation(function(this: any) {
                        theThis = this;
                    });
                    const bind: Value<T> = newBindValue({
                        id: 'test',
                        initialValue,
                    });
                    bind.value;
                    expect(theThis).toBe(bind);
                });
            });

            describe('getValue', function() {
                it('should change the value', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                    });
                    expect(bind.value).toBeUndefined();
                    bind.setValue('bar');
                    expect(bind.value).toBe('bar');
                });

                it('should return initialValue', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        initialValue: 'initial value',
                    });
                    expect(bind.value).toBe('initial value');
                });

                it('should return initialValue()', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        initialValue: () => 'initial value',
                    });
                    expect(bind.value).toBe('initial value');
                });

                it('should throw error if only getValue is specified ', function() {
                    expect(() => {
                        bindStringValue({
                            id: 'test',
                            getValue: () => '',
                        });
                    }).toThrow();
                });

                it('should have ValueImpl as `this`', function() {
                    let theThis: any = undefined;
                    const getValue = jest.fn().mockImplementation(function(this: any) {
                        theThis = this;
                    });
                    const bind: Value<T> = newBindValue({
                        id: 'test',
                        getValue,
                        setValue: jest.fn(),
                    });
                    bind.value;
                    expect(theThis).toBe(bind);
                });
            });

            describe('setValue', function() {
                it('should change the value', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                    });
                    expect(bind.value).toBeUndefined();
                    bind.setValue('bar');
                    expect(bind.value).toBe('bar');
                });

                it('should throw error if only setValue is specified', function() {
                    expect(() => {
                        bindStringValue({
                            id: 'test',
                            setValue: v => v,
                        });
                    }).toThrow();
                });

                it('should console.warn if field is readOnly', function() {
                    const consoleWarn = jest.spyOn(console, 'warn');
                    consoleWarn.mockImplementation(() => {});
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        readOnly: () => true,
                    });

                    bind.setValue('bar');
                    expect(consoleWarn).toHaveBeenCalledTimes(1);
                    expect(bind.value).toBeUndefined();
                    consoleWarn.mockRestore();
                });

                it('should console.warn if field is disabled', function() {
                    const consoleWarn = jest.spyOn(console, 'warn');
                    consoleWarn.mockImplementation(() => {});
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        disabled: () => true,
                    });

                    bind.setValue('bar');
                    expect(consoleWarn).toHaveBeenCalledTimes(1);
                    expect(bind.value).toBeUndefined();
                    consoleWarn.mockRestore();
                });

                it('should have ValueImpl as `this`', function() {
                    let theThis: any = undefined;
                    const setValue = jest.fn().mockImplementation(function(this: any) {
                        theThis = this;
                    });
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        getValue: jest.fn(),
                        setValue,
                    });
                    bind.setValue('foo');
                    expect(theThis).toBe(bind);
                });
            });

            describe('setValue/getValue', function() {
                it('should change the value', function() {
                    let value: string | undefined = undefined;
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        setValue: v => (value = v),
                        getValue: () => value,
                    });
                    expect(bind.value).toBeUndefined();
                    bind.setValue('bar');
                    expect(bind.value).toBe('bar');
                    expect(value).toBe('bar');
                });

                it('should return initialValue if getValue() returns undefined', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        initialValue: 'initial value',
                        setValue: () => {},
                        getValue: () => undefined,
                    });
                    expect(bind.value).toBe('initial value');
                });

                it('should console.warn if field is readOnly', function() {
                    let value: string | undefined = undefined;
                    const consoleWarn = jest.spyOn(console, 'warn');
                    consoleWarn.mockImplementation(() => {});
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        readOnly: () => true,
                        setValue: v => (value = v),
                        getValue: () => value,
                    });

                    bind.setValue('bar');
                    expect(consoleWarn).toHaveBeenCalledTimes(1);
                    expect(bind.value).toBeUndefined();
                    expect(value).toBeUndefined();
                    consoleWarn.mockRestore();
                });

                it('should console.warn if field is disabled', function() {
                    let value: string | undefined = undefined;
                    const consoleWarn = jest.spyOn(console, 'warn');
                    consoleWarn.mockImplementation(() => {});
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        disabled: () => true,
                        setValue: v => (value = v),
                        getValue: () => value,
                    });

                    bind.setValue('bar');
                    expect(consoleWarn).toHaveBeenCalledTimes(1);
                    expect(bind.value).toBeUndefined();
                    expect(value).toBeUndefined();
                    consoleWarn.mockRestore();
                });
            });
            describe('isInitialValue', function() {
                describe('without initialValue', function() {
                    it('should return undefined if no initialValue', function() {
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                        });
                        expect(bind.isInitialValue).toBeUndefined();
                    });
                    it('should return undefined if value is set', function() {
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                        });
                        bind.setValue('hallo');
                        expect(bind.isInitialValue).toBeUndefined();
                    });
                });

                describe('with initialValue', function() {
                    it('should return true if not set and initial value undefined', function() {
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                            initialValue: () => undefined,
                        });
                        expect(bind.isInitialValue).toBe(true);
                    });
                    it('should return true if not set and initial value null', function() {
                        const bind = bindStringValueOrNull({
                            id: 'test',
                            initialValue: () => null,
                        });
                        expect(bind.isInitialValue).toBe(true);
                    });
                    it('should return true if initial value not null and value not set', function() {
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                            initialValue: () => 'foo',
                        });
                        expect(bind.isInitialValue).toBe(true);
                    });
                    it('should return false if different', function() {
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                            initialValue: () => 'foo',
                        });
                        bind.setValue('hallo');
                        expect(bind.isInitialValue).toBe(false);
                    });
                    it('should return true if same', function() {
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                            initialValue: () => 'foo',
                        });
                        bind.setValue('foo');
                        expect(bind.isInitialValue).toBe(true);
                    });
                    describe('with compare function and complicated data', function() {
                        interface Data {
                            name: string;
                            data: number[];
                        }
                        it('should be true with the default compare', function() {
                            const bind: Value<Data> = new ValueImpl<any, Data, any>({
                                id: 'theId',
                                initialValue: () => ({ name: 'foo', data: [1, 2, 3] }),
                            });
                            bind.setValue({ name: 'foo', data: [1, 2, 3] });
                            expect(bind.isInitialValue).toBe(true);
                        });
                        it('should be false if something is different in the deep structure', function() {
                            const bind: Value<Data> = new ValueImpl<any, Data, any>({
                                id: 'theId',
                                initialValue: () => ({ name: 'foo', data: [1, 2, 3] }),
                            });
                            bind.setValue({ name: 'foo', data: [3, 2, 1] });
                            expect(bind.isInitialValue).toBe(false);
                        });
                        it('should be false with === compare', function() {
                            const bind: Value<Data> = new ValueImpl<any, Data, ValueOptions<any, Data>>({
                                id: 'theId',
                                initialValue: () => ({ name: 'foo', data: [1, 2, 3] }),
                                valueCompareFunction: (a, b) => a === b,
                            });
                            bind.setValue({ name: 'foo', data: [1, 2, 3] });
                            expect(bind.isInitialValue).toBe(false);
                        });
                        it('should true if default and value are undefined', function() {
                            const bind: Value<Data | undefined> = new ValueImpl<any, Data, ValueOptions<any, Data>>({
                                id: 'theId',
                                initialValue: () => undefined,
                            });
                            bind.setValue(undefined);
                            expect(bind.isInitialValue).toBe(true);
                        });
                        it('should false if value is set and initialValue is undefined', function() {
                            const bind: Value<Data | undefined> = new ValueImpl<any, Data, ValueOptions<any, Data>>({
                                id: 'theId',
                                initialValue: () => undefined,
                            });
                            bind.setValue({ name: 'foo', data: [1, 2, 3] });
                            expect(bind.isInitialValue).toBe(false);
                        });
                    });
                });

                describe('with setValue', function() {
                    it('should return false by default', function() {
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                            initialValue: () => undefined,
                            setValue: jest.fn(),
                            getValue: jest.fn(),
                        });
                        expect(bind.isInitialValue).toBe(true);
                    });
                    it('should return undefined by default', function() {
                        let theValue: string;
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                            initialValue: () => 'foo',
                            setValue: value => (theValue = value),
                            getValue: () => theValue,
                        });
                        bind.setValue('hallo');
                        expect(bind.isInitialValue).toBe(false);
                    });
                    it('should return undefined by default', function() {
                        let theValue: string;
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                            initialValue: () => 'foo',
                            setValue: value => (theValue = value),
                            getValue: () => theValue,
                        });
                        bind.setValue('foo');
                        expect(bind.isInitialValue).toBe(true);
                    });
                });
            });
            describe('resetToInitialValue', function() {
                describe('without setValue/getValue', function() {
                    it('should reset to undefined', function() {
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                        });
                        bind.setValue('foo');
                        bind.resetToInitialValue();
                        expect(bind.value).toBeUndefined();
                    });
                    it('should reset to undefined', function() {
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                            initialValue: () => 'foo',
                        });
                        bind.setValue('hello');
                        bind.resetToInitialValue();
                        expect(bind.value).toBe('foo');
                    });
                });
                describe('with setValue/getValue', function() {
                    it('should throw if no resetToInitialValue is called', function() {
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                            setValue: jest.fn(),
                            getValue: jest.fn(),
                        });
                        bind.setValue('foo');
                        expect(() => bind.resetToInitialValue()).toThrow();
                    });
                    it('should reset to undefined', function() {
                        const resetToInitialValue = jest.fn();
                        const bind: Value<string> = bindStringValue({
                            id: 'test',
                            setValue: jest.fn(),
                            getValue: jest.fn(),
                            resetToInitialValue,
                        });
                        bind.setValue('foo');
                        expect(resetToInitialValue).not.toBeCalled();
                        bind.resetToInitialValue();
                        expect(resetToInitialValue).toBeCalled();
                    });
                });
            });
        });

        describe('onEnterField', function() {
            it('should call options.onEnterField', function() {
                const onEnterField = jest.fn();
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onEnterField,
                });
                bind.onEnterField();
                expect(onEnterField).toHaveBeenCalledTimes(1);
            });

            it('should have ValueImpl as `this`', function() {
                let theThis: any = undefined;
                const onEnterField = jest.fn().mockImplementation(function(this: any) {
                    theThis = this;
                });
                const bind: Value<T> = newBindValue({
                    id: 'test',
                    onEnterField,
                });
                bind.onEnterField();
                expect(theThis).toBe(bind);
            });

            it('should have ValueImpl as argument', function() {
                let theThis: any = undefined;
                const onEnterField = jest.fn().mockImplementation(function(b: any) {
                    theThis = b;
                });
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onEnterField,
                });
                bind.onEnterField();
                expect(theThis).toBe(bind);
            });
        });

        describe('onSetValue', function() {
            it('should be called with setValue is called.', function() {
                const onSetValue = jest.fn();
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onSetValue,
                });
                bind.setValue('new Value');
                expect(onSetValue).toHaveBeenCalledTimes(1);
                expect(onSetValue).toHaveBeenCalledWith('new Value', bind);
            });
            it('should be able to modify the value.', function() {
                const onSetValue = jest.fn().mockImplementation(x => '<<' + x + '>>');
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onSetValue,
                });
                bind.setValue('new Value');
                expect(bind.value).toBe('<<new Value>>');
            });
            it('should modify value of options.setValue', function() {
                const onSetValue = jest.fn().mockImplementation(x => '<<' + x + '>>');
                const setValue = jest.fn();
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onSetValue,
                    setValue,
                    getValue: jest.fn(),
                });
                bind.setValue('new Value');
                expect(setValue).toBeCalledWith('<<new Value>>');
            });

            it('should have ValueImpl as `this`', function() {
                let theThis: any = undefined;
                const onSetValue = jest.fn().mockImplementation(function(this: any) {
                    theThis = this;
                });
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onSetValue,
                    setValue: jest.fn(),
                    getValue: jest.fn(),
                });
                bind.setValue('new Value');
                expect(theThis).toBe(bind);
            });
        });

        describe('onAfterSetValue', function() {
            it('should be called with setValue is called.', function() {
                const onAfterSetValue = jest.fn();
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onAfterSetValue,
                });
                bind.setValue('new Value');
                expect(onAfterSetValue).toHaveBeenCalledTimes(1);
                expect(onAfterSetValue).toHaveBeenCalledWith('new Value', bind);
            });

            it('should have ValueImpl as `this`', function() {
                let theThis: any = undefined;
                const onAfterSetValue = jest.fn().mockImplementation(function(this: any) {
                    theThis = this;
                });
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onAfterSetValue,
                    setValue: jest.fn(),
                    getValue: jest.fn(),
                });
                bind.setValue('new Value');
                expect(theThis).toBe(bind);
            });
        });
        describe('setValue clears errors', function() {
            it('should clear error when value is changed', function() {
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                });
                bind.setValue('new Value');
                bind.setError('some error');
                bind.setValue('other Value');
                expect(bind.errors).toEqual([]);
            });
            it('should not clear error when value is unchanged', function() {
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                });
                bind.setValue('new Value');
                bind.setError('some error');
                bind.setValue('new Value');
                expect(bind.errors).toEqual(['some error']);
            });
            it('should not clear error when setValue method is provided', function() {
                let value: any;
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    setValue: v => (value = v),
                    getValue: () => value,
                });
                bind.setValue('new Value');
                bind.setError('some error');
                bind.setValue('other Value');
                expect(bind.errors).toEqual(['some error']);
            });
        });

        describe('onExitField', function() {
            it('should call options.onExitField', function() {
                const onExitField = jest.fn();
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onExitField,
                });
                bind.onExitField();
                expect(onExitField).toHaveBeenCalledTimes(1);
            });

            it('should have ValueImpl as `this`', function() {
                let theThis: any = undefined;
                const onExitField = jest.fn().mockImplementation(function(this: any) {
                    theThis = this;
                });
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onExitField,
                });
                bind.onExitField();
                expect(theThis).toBe(bind);
            });

            it('should have ValueImpl as argument', function() {
                let theThis: any = undefined;
                const onExitField = jest.fn().mockImplementation(function(b: any) {
                    theThis = b;
                });
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    onExitField,
                });
                bind.onExitField();
                expect(theThis).toBe(bind);
            });
        });
        describe('save', function() {
            describe('call onSave on Value.save', function() {
                it('should not be called on save if data has  not changed', function() {
                    const onSave = jest.fn();
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        initialValue: 'hello',
                        onSave,
                    });
                    bind.setValue('world');
                    bind.save();
                    expect(onSave).toHaveBeenCalled();
                });

                it('should not be called on save if data has  not changed', function() {
                    const onSave = jest.fn();
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        initialValue: 'hello',
                        onSave,
                    });
                    bind.setValue('hello');
                    bind.save();
                    expect(onSave).not.toHaveBeenCalled();
                });
                it('should be called with moxb as first argument', function() {
                    let theArg: any = undefined;
                    const onSave = jest.fn().mockImplementation(function(arg: any) {
                        theArg = arg;
                    });
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        onSave,
                    });
                    bind.setValue('hello');
                    bind.save();
                    expect(onSave).toHaveBeenCalledTimes(1);
                    expect(theArg).toBe(bind);
                });
            });

            describe('isSaving', function() {
                it('should be false by default', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                    });
                    expect(bind.isSaving).toBe(false);
                });
                it('should be false after save', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                    });
                    bind.setValue('hello');
                    bind.save();
                    expect(bind.isSaving).toBe(false);
                });
                it('should be true if onSave does not call `done`', function() {
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        onSave: jest.fn(),
                    });
                    bind.setValue('hello');
                    bind.save();
                    expect(bind.isSaving).toBe(true);
                });
                it('should be true until done is called', function() {
                    let theDone: any = undefined;
                    const onSave = jest.fn().mockImplementation(function(_arg: any, done: any) {
                        theDone = done;
                    });
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        onSave,
                    });
                    bind.setValue('hello');
                    bind.save();
                    expect(bind.isSaving).toBe(true);
                    theDone();
                    expect(bind.isSaving).toBe(false);
                });
                it('should be true until done is called wit error', function() {
                    let theDone: any = undefined;
                    const onSave = jest.fn().mockImplementation(function(_arg: any, done: any) {
                        theDone = done;
                    });
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        onSave,
                    });
                    bind.setValue('hello');
                    bind.save();
                    expect(bind.isSaving).toBe(true);
                    theDone(new Error());
                    expect(bind.isSaving).toBe(false);
                });
                it('should set error if done is called with an error', function() {
                    const onSave = jest.fn().mockImplementation(function(_arg: any, done: any) {
                        done(new Error('some error'));
                    });
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        onSave,
                    });
                    bind.setValue('hello');
                    bind.save();
                    expect(bind.errors).toContain('some error');
                });
                it('should clear error on save success', function() {
                    const onSave = jest.fn().mockImplementation(function(_arg: any, done: any) {
                        done();
                    });
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        onSave,
                    });
                    bind.setValue('hello');
                    bind.setError('some error');
                    bind.save();
                    expect(bind.errors).toEqual([]);
                });
            });

            describe('onSave', function() {
                it('should have ValueImpl as `this`', function() {
                    let theThis: any = undefined;
                    const onSave = jest.fn().mockImplementation(function(this: any) {
                        theThis = this;
                    });
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        onSave,
                    });
                    bind.setValue('hello');
                    bind.save();
                    expect(theThis).toBe(bind);
                });
                it('should have ValueImpl as first argument', function() {
                    let theBind: any = undefined;
                    const onSave = jest.fn().mockImplementation(function(b: Value<string>) {
                        theBind = b;
                    });
                    const bind: Value<string> = bindStringValue({
                        id: 'test',
                        onSave,
                    });
                    bind.setValue('hello');
                    bind.save();
                    expect(theBind).toBe(bind);
                });
            });
        });
        describe('required', function() {
            it('should create an error onSave, if required is true and no value was insert', function() {
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    required: true,
                });
                expect(bind.required).toBe(true);
                bind.save();
                expect(bind.errors!.length).toBe(1);
                expect(bind.errors).toContain('[ValueImpl.error.required] This field is required and must be set');
            });
            it('should create an error onExitField, if required is true and no value was insert', function() {
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    required: true,
                });
                expect(bind.required).toBe(true);
                bind.onExitField();
                expect(bind.errors!.length).toBe(1);
                expect(bind.errors).toContain('[ValueImpl.error.required] This field is required and must be set');
            });
            it('should be false if options.required is false', function() {
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                    required: false,
                });
                expect(bind.required).toBe(false);
            });
            it('should not create an error, if required is not defined', function() {
                const bind: Value<string> = bindStringValue({
                    id: 'test',
                });
                expect(bind.required).toBeUndefined();
                bind.save();
                expect(bind.errors!.length).toBe(0);
            });
        });
    });
}
