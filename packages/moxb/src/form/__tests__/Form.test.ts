import { FormImpl, Form, TextImpl } from '../..';

describe('Form', function() {
    let bindForm: Form;

    describe('value', function() {
        it('should throw if empty', function() {
            expect(() => {
                bindForm = new FormImpl({
                    id: 'Impl.testForm',
                    values: [],
                });
            }).toThrow();
        });
    });

    describe('allErrors', function() {
        it('should return an array with all occurred errors', function() {
            const bindText = new TextImpl({
                id: 'text',
                label: 'text',
            });
            const bindPass = new TextImpl({
                id: 'password',
                label: 'password',
            });
            bindForm = new FormImpl({
                id: 'Impl.testForm',
                values: [bindText, bindPass],
            });
            bindText.setError('foo');
            bindText.setError('doo');
            bindPass.setError('bar');
            expect(bindForm.allErrors).toEqual(['text: foo', 'text: doo', 'password: bar']);
        });
    });
});
