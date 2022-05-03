import { FormImpl, TextImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FormAnt } from '../FormAnt';
import { shallowMoxbToJson } from './enzymeHelper';

describe('FormAnt', function () {
    const onSaveUserText = jest.fn();
    const onSavePasswordText = jest.fn();
    const onSubmitMock = jest.fn();
    const formUserText = new TextImpl({
        id: 'id.formUserText',
        label: 'Username',
        onSave: onSaveUserText,
    });
    const formPasswordText = new TextImpl({
        id: 'id.formUserText',
        label: 'Username',
        onSave: onSavePasswordText,
    });

    function newFormOperation(...opt: any[]) {
        return new FormImpl(
            Object.assign(
                {
                    id: 'id.testForm',
                    values: [formUserText, formPasswordText],
                    onSubmit: onSubmitMock,
                },
                ...opt
            )
        );
    }

    it('should render a form element by default', function () {
        const operation = newFormOperation();
        expect(shallowMoxbToJson(shallow(<FormAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should throw if no values for children were defined', function () {
        expect(() => {
            new FormImpl({
                id: 'id.testForm',
                values: [],
                onSubmit: onSubmitMock,
            });
        }).toThrow();
    });

    it('should return null if invisible', function () {
        const operation = newFormOperation({ invisible: () => true });
        expect(shallow(<FormAnt operation={operation} />).type()).toBeNull();
    });

    it('should show an alert, if an error happens in a child component', function () {
        const operation = newFormOperation();
        formUserText.setError('New error');
        const wrapper = shallow(<FormAnt operation={operation} />);
        expect(wrapper.render().find('div.ant-alert').length).toBe(1);
    });

    it('should not show an alert on error with property "hideErrors" set', function () {
        const operation = newFormOperation();
        formUserText.setError('New error');
        const wrapper = shallow(<FormAnt hideErrors operation={operation} />);
        expect(wrapper.render().find('div.ant-alert').length).toBe(0);
    });

    it('should show an alert, if an error in the form happened', function () {
        const operation = newFormOperation();
        operation.setError('New error');
        const wrapper = shallow(<FormAnt operation={operation} />);
        expect(wrapper.render().find('div.ant-alert').length).toBe(1);
    });
});
