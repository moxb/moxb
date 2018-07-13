import { setTFunction, t, translateDefault, translateKeysDefault, translateKeysOnly } from '../../i18n/i18n';
import { Bool } from '../Bool';
import { BoolImpl, BoolOptions } from '../BoolImpl';

describe('label', function() {
    function newBind(options: BoolOptions): Bool {
        return new BoolImpl(options);
    }
    beforeEach(function() {
        setTFunction(translateKeysDefault);
    });

    it('should be undefined by default', function() {
        expect(t('key', 'The Default')).toBe('[key] The Default');
        const bind = newBind({
            id: 'test',
        });
        expect(bind.domId).toBe('test');
        expect(bind.labelToggle).toBeUndefined();
    });
    it('should be translated', function() {
        const bind = newBind({
            id: 'test',
            label: 'Default String',
        });
        expect(bind.labelToggle).toBe('[test.label] Default String');
    });
    it('should be updated when translation changes', function() {
        const bind = newBind({
            id: 'test',
            label: 'Default String',
        });
        setTFunction(translateKeysOnly);
        expect(bind.labelToggle).toBe('[test.label]');
    });
    it('should take a function', function() {
        const label = jest.fn().mockReturnValue('The Translated String');
        const bind = newBind({
            id: 'test',
            label,
        });
        setTFunction(translateKeysOnly);
        expect(bind.labelToggle).toBe('The Translated String');
    });
    it('should take a function that returns undefined', function() {
        const label = jest.fn().mockReturnValue(undefined);
        const bind = newBind({
            id: 'test',
            label,
        });
        setTFunction(translateKeysOnly);
        expect(bind.labelToggle).toBeUndefined();
    });
    it('should have the BindImpl as `this`', function() {
        let theThis: any = undefined;
        const label = jest.fn().mockImplementation(function(this: any) {
            theThis = this;
        });
        const bind = newBind({
            id: 'test',
            label,
        });
        bind.labelToggle;
        expect(theThis).toBe(bind);
    });
});

describe('labelTrue', function() {
    function newBind(options: BoolOptions): Bool {
        const bind = new BoolImpl(options);
        bind.setValue(true);
        return bind;
    }
    beforeEach(function() {
        setTFunction(translateKeysDefault);
    });

    it('should be undefined by default', function() {
        expect(t('key', 'The Default')).toBe('[key] The Default');
        const bind = newBind({
            id: 'test',
        });
        expect(bind.domId).toBe('test');
        expect(bind.labelToggle).toBeUndefined();
    });
    it('should be translated', function() {
        const bind = newBind({
            id: 'test',
            labelTrue: 'True String',
        });
        expect(bind.labelToggle).toBe('[test.label.true] True String');
    });
    it('should be updated when translation changes', function() {
        const bind = newBind({
            id: 'test',
            labelTrue: 'True String',
        });
        setTFunction(translateKeysOnly);
        expect(bind.labelToggle).toBe('[test.label.true]');
    });
    it('should take a function', function() {
        const labelTrue = jest.fn().mockReturnValue('The Translated String');
        const bind = newBind({
            id: 'test',
            labelTrue,
        });
        setTFunction(translateKeysOnly);
        expect(bind.labelToggle).toBe('The Translated String');
    });
    it('should take a function that returns undefined', function() {
        const labelTrue = jest.fn().mockReturnValue(undefined);
        const bind = newBind({
            id: 'test',
            labelTrue,
        });
        setTFunction(translateKeysOnly);
        expect(bind.labelToggle).toBeUndefined();
    });
    it('should have the BindImpl as `this`', function() {
        let theThis: any = undefined;
        const labelTrue = jest.fn().mockImplementation(function(this: any) {
            theThis = this;
        });
        const bind = newBind({
            id: 'test',
            labelTrue,
        });
        bind.labelToggle;
        expect(theThis).toBe(bind);
    });
});

describe('labelFalse', function() {
    function newBind(options: BoolOptions): Bool {
        return new BoolImpl(options);
    }
    beforeEach(function() {
        setTFunction(translateKeysDefault);
    });

    it('should be undefined by default', function() {
        expect(t('key', 'The Default')).toBe('[key] The Default');
        const bind = newBind({
            id: 'test',
        });
        expect(bind.domId).toBe('test');
        expect(bind.labelToggle).toBeUndefined();
    });
    it('should be translated', function() {
        const bind = newBind({
            id: 'test',
            labelFalse: 'False String',
        });
        expect(bind.labelToggle).toBe('[test.label.false] False String');
    });
    it('should be updated when translation changes', function() {
        const bind = newBind({
            id: 'test',
            labelFalse: 'False String',
        });
        setTFunction(translateKeysOnly);
        expect(bind.labelToggle).toBe('[test.label.false]');
    });
    it('should take a function', function() {
        const labelFalse = jest.fn().mockReturnValue('The Translated String');
        const bind = newBind({
            id: 'test',
            labelFalse,
        });
        setTFunction(translateKeysOnly);
        expect(bind.labelToggle).toBe('The Translated String');
    });
    it('should take a function that returns undefined', function() {
        const labelFalse = jest.fn().mockReturnValue(undefined);
        const bind = newBind({
            id: 'test',
            labelFalse,
        });
        setTFunction(translateKeysOnly);
        expect(bind.labelToggle).toBeUndefined();
    });
    it('should have the BindImpl as `this`', function() {
        let theThis: any = undefined;
        const labelFalse = jest.fn().mockImplementation(function(this: any) {
            theThis = this;
        });
        const bind = newBind({
            id: 'test',
            labelFalse,
        });
        bind.labelToggle;
        expect(theThis).toBe(bind);
    });
});
describe('labelTue, labelFalse and label combinations', function() {
    function newBind(options: BoolOptions): Bool {
        return new BoolImpl(options);
    }
    beforeEach(function() {
        setTFunction(translateDefault);
    });
    describe('only label', function() {
        it('string: should show only label', function() {
            const bind = newBind({
                id: 'test',
                label: 'Label',
            });
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label');
            bind.toggle();
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label');
        });
        it('function: should show only label', function() {
            const bind = newBind({
                id: 'test',
                label: jest.fn().mockReturnValue('Label'),
            });
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label');
            bind.toggle();
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label');
        });
    });
    describe('string labelTrue and label', function() {
        it('string: false=Label and true=labelTrue', function() {
            const bind = newBind({
                id: 'test',
                labelTrue: 'Label True',
                label: 'Label',
            });
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label');
            bind.toggle();
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label True');
        });
        it('function: false=Label and true=labelTrue', function() {
            const bind = newBind({
                id: 'test',
                labelTrue: jest.fn().mockReturnValue('Label True'),
                label: jest.fn().mockReturnValue('Label'),
            });
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label');
            bind.toggle();
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label True');
        });
    });
    describe('string labelFalse and label', function() {
        it('string: false=labelFalse and true=label', function() {
            const bind = newBind({
                id: 'test',
                labelFalse: 'Label False',
                label: 'Label',
            });
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label False');
            bind.toggle();
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label');
        });
        it('function: false=labelFalse and true=label', function() {
            const bind = newBind({
                id: 'test',
                labelFalse: jest.fn().mockReturnValue('Label False'),
                label: jest.fn().mockReturnValue('Label'),
            });
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label False');
            bind.toggle();
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label');
        });
    });
    describe('labelTrue and labelFalse', function() {
        it('string: false=labelFalse and true=labelTrue', function() {
            const bind = newBind({
                id: 'test',
                labelFalse: 'Label False',
                labelTrue: 'Label True',
            });
            expect(bind.label).toBe('Label False');
            expect(bind.labelToggle).toBe('Label False');
            bind.toggle();
            expect(bind.label).toBe('Label True');
            expect(bind.labelToggle).toBe('Label True');
        });
        it('function labelTrue and labelFalse', function() {
            const bind = newBind({
                id: 'test',
                labelFalse: jest.fn().mockReturnValue('Label False'),
                labelTrue: jest.fn().mockReturnValue('Label True'),
            });
            expect(bind.label).toBe('Label False');
            expect(bind.labelToggle).toBe('Label False');
            bind.toggle();
            expect(bind.label).toBe('Label True');
            expect(bind.labelToggle).toBe('Label True');
        });
        it('function labelTrue and labelFalse', function() {
            const bind = newBind({
                id: 'test',
                labelFalse: jest.fn().mockReturnValue('Label False'),
                labelTrue: jest.fn().mockReturnValue('Label True'),
            });
            expect(bind.label).toBe('Label False');
            expect(bind.labelToggle).toBe('Label False');
            bind.toggle();
            expect(bind.label).toBe('Label True');
            expect(bind.labelToggle).toBe('Label True');
        });
    });
    describe('labelTrue, labelFalse and label', function() {
        it('string: false=labelFalse and true=labelTrue', function() {
            const bind = newBind({
                id: 'test',
                labelFalse: 'Label False',
                labelTrue: 'Label True',
                label: 'Label',
            });
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label False');
            bind.toggle();
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label True');
        });
        it('function labelTrue and labelFalse', function() {
            const bind = newBind({
                id: 'test',
                labelFalse: jest.fn().mockReturnValue('Label False'),
                label: jest.fn().mockReturnValue('Label'),
                labelTrue: jest.fn().mockReturnValue('Label True'),
            });
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label False');
            bind.toggle();
            expect(bind.label).toBe('Label');
            expect(bind.labelToggle).toBe('Label True');
        });
    });
});

describe('toggle', function() {
    it('should toggle undefined to true', function() {
        const bind: Bool = new BoolImpl({ id: 'theId' });
        expect(bind.value).toBe(undefined);
        bind.toggle();
        expect(bind.value).toBe(true);
    });
    it('should toggle undefined to true', function() {
        const bind: Bool = new BoolImpl({ id: 'theId' });
        bind.setValue(false);
        bind.toggle();
        expect(bind.value).toBe(true);
    });
    it('should toggle true to false', function() {
        const bind: Bool = new BoolImpl({ id: 'theId' });
        bind.setValue(true);
        bind.toggle();
        expect(bind.value).toBe(false);
    });
    it('should be bound', function() {
        const bind: Bool = new BoolImpl({ id: 'theId' });
        bind.setValue(true);
        const toggle = bind.toggle;
        toggle();
        expect(bind.value).toBe(false);
    });
});
