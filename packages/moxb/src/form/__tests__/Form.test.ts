import { FormImpl, Form } from '../..';

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
});
