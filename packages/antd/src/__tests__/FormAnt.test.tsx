import { FormImpl, TextImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FormAnt } from '../FormAnt';
import { FormItemAnt } from '../FormItemAnt';

describe('FormItemAnt', function() {
    const formUserText = new TextImpl({
        id: 'id.formUserText',
        label: 'Username',
        onSave: (bind, done) => jest.fn(),
    });
    const formPasswordText = new TextImpl({
        id: 'id.formUserText',
        label: 'Username',
        onSave: (bind, done) => jest.fn(),
    });
    function newFormOperation(opt?: any) {
        const onSubmitMock = jest.fn();
        return new FormImpl(
            Object.assign(
                {
                    id: 'id.testForm',
                    values: [formUserText, formPasswordText],
                    onSubmit: (bind: any, done: any) => onSubmitMock,
                },
                ...opt
            )
        );
    }

    it('should render a form element by default', function() {
        const operation = newFormOperation();
        expect(shallow(<FormAnt operation={operation} />)).toMatchSnapshot();
    });

    it('should throw if no values for children were defined', function() {
        const onSubmitMock = jest.fn();
        expect(() => {
            new FormImpl({
                id: 'id.testForm',
                values: [],
                onSubmit: (bind, done) => onSubmitMock,
            });
        }).toThrow();
    });

    it('should return null if invisible', function() {
        const operation = newFormOperation({ invisible: () => true });
        expect(shallow(<FormAnt operation={operation} />).type()).toBeNull();
    });

    it('should show an alert, if an error happens in a child component', function() {
        const operation = newFormOperation();
        formUserText.setError('New error');
        const wrapper = shallow(<FormAnt operation={operation} />);
        expect(wrapper.render().find('div.ant-alert').length).toBe(1);
    });

    it('should not show an alert on error with property "hideErrors" set', function() {
        const operation = newFormOperation();
        formUserText.setError('New error');
        const wrapper = shallow(<FormAnt hideErrors operation={operation} />);
        expect(wrapper.render().find('div.ant-alert').length).toBe(0);
    });

    it('should show an alert, if an error in the form happened', function() {
        const operation = newFormOperation();
        operation.setError('New error');
        const wrapper = shallow(<FormAnt operation={operation} />);
        expect(wrapper.render().find('div.ant-alert').length).toBe(1);
    });
});
