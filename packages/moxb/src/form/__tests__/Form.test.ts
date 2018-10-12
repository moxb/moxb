import { FormImpl, Form, TextImpl } from '../..';

describe('Form', function() {
    let bindForm: Form;
    const onSaveUserText = jest.fn();
    const onSavePasswordText = jest.fn();
    const onSubmitMock = jest.fn();
    const bindText = new TextImpl({
        id: 'text',
        label: 'text',
        onSave: onSaveUserText,
        initialValue: () => 'foo',
    });
    const bindPass = new TextImpl({
        id: 'password',
        label: 'password',
        onSave: onSavePasswordText,
    });

    describe('value', function() {
        it('should throw if empty', function() {
            expect(() => {
                bindForm = new FormImpl({
                    id: 'Impl.testForm',
                    values: [],
                });
            }).toThrow();
        });

        it('should throw if not defined', function() {
            expect(() => {
                bindForm = new FormImpl({
                    id: 'Impl.testForm',
                    values: undefined as any,
                });
            }).toThrow();
        });
    });

    describe('canSubmitForm', function() {
        it('should return true, if the form has no longer the initial values ', function() {
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindText, bindPass],
            });
            bindText.setValue('Name');
            expect(bindForm.canSubmitForm).toEqual(true);
        });

        it('should return false, if the form has not changed ', function() {
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindText, bindPass],
            });
            bindText.setValue('Name');
            bindText.resetToInitialValue();
            expect(bindForm.canSubmitForm).toEqual(false);
        });
    });

    describe('allErrors', function() {
        it('should return an array with all occurred errors', function() {
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                label: 'form',
                values: [bindText, bindPass],
            });
            bindText.setError('foo');
            bindForm.setError('doo');
            bindPass.setError('bar');
            expect(bindForm.allErrors).toEqual(['text: foo', 'password: bar', 'form: doo']);
        });
        it('should return an array with occurred errors from the children', function() {
            bindText.clearErrors();
            bindPass.clearErrors();
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindText, bindPass],
            });
            bindText.setError('foo');
            bindText.setError('doo');
            bindPass.setError('bar');
            expect(bindForm.allErrors).toEqual(['text: foo', 'text: doo', 'password: bar']);
        });

        it('should return an array with all occurred errors', function() {
            bindText.clearErrors();
            bindPass.clearErrors();
            const bindNoText = new TextImpl({
                id: 'textNoLabel',
                onSave: onSaveUserText,
                initialValue: () => 'foo',
            });
            const bindNoPass = new TextImpl({
                id: 'passwordNoLAbel',
                onSave: onSavePasswordText,
            });
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindNoText, bindNoPass],
            });
            bindNoText.setError('foo');
            bindNoText.setError('doo');
            bindNoPass.setError('bar');
            expect(bindForm.allErrors).toEqual(['foo', 'doo', 'bar']);
        });
    });

    describe('hasErrors', function() {
        it('should return true if errors have occurred', function() {
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindText, bindPass],
            });
            bindText.setError('foo');
            expect(bindForm.hasErrors).toEqual(true);
        });

        it('should return false if no errors occurred', function() {
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindText, bindPass],
            });
            bindText.setError('foo');
            bindForm.clearAllErrors();
            expect(bindForm.hasErrors).toEqual(false);
        });

        it('should return true if an error in the form occurred', function() {
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindText, bindPass],
            });
            bindForm.setError('foo');
            expect(bindForm.hasErrors).toEqual(true);
        });
    });

    describe('onSubmitForm', function() {
        it('should call onSubmit for each child the onSave method', function() {
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindText, bindPass],
                onSubmit: onSubmitMock,
            });
            bindText.setValue('Name');
            bindPass.setValue('Pass');
            bindForm.onSubmitForm();
            expect(onSubmitMock).toHaveBeenCalledTimes(1);
            expect(onSaveUserText).toHaveBeenCalledTimes(1);
            expect(onSavePasswordText).toHaveBeenCalledTimes(1);
        });
    });

    describe('submitDone', function() {
        it('should call submitDone after onSubmit with an error', function() {
            let theThis: any = undefined;
            const onSubmitMockNew = jest.fn((bind, done) => {
                theThis = bind;
                done('Password not correct');
            });
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindText, bindPass],
                onSubmit: (bind, done) => onSubmitMockNew(bind, done),
            });
            bindForm.onSubmitForm();
            expect(onSubmitMockNew).toHaveBeenCalledTimes(1);
            expect(theThis).toBe(bindForm);
        });

        it('should call submitDone after onSubmit with no error', function() {
            let theThis: any = undefined;
            const onSubmitMockNew = jest.fn((bind, done) => {
                theThis = bind;
                done();
            });
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindText, bindPass],
                onSubmit: (bind, done) => onSubmitMockNew(bind, done),
            });
            bindForm.onSubmitForm();
            expect(onSubmitMockNew).toHaveBeenCalledTimes(1);
            expect(theThis).toBe(bindForm);
        });
    });
});
