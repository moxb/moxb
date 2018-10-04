import { FormImpl, TextImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FormItemAnt } from '../FormItemAnt';

describe('FormItemAnt', function() {
    const formUserText = new TextImpl({
        id: 'ApplicationImpl.formUserText',
        label: 'Username',
        onSave: (bind, done) => jest.fn(),
    });
    const formPasswordText = new TextImpl({
        id: 'ApplicationImpl.formUserText',
        label: 'Username',
        onSave: (bind, done) => jest.fn(),
    });

    it('should render a form item by default', function() {
        const onSubmitMock = jest.fn();
        const operation = new FormImpl({
            id: 'id.testForm',
            values: [formUserText, formPasswordText],
            onSubmit: (bind, done) => onSubmitMock,
        });
        expect(shallow(<FormItemAnt operation={operation} />)).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const onSubmitMock = jest.fn();
        const operation = new FormImpl({
            id: 'id.testForm',
            values: [formUserText, formPasswordText],
            onSubmit: (bind, done) => onSubmitMock,
            invisible: () => true,
        });
        expect(shallow(<FormItemAnt operation={operation} />).type()).toBeNull();
    });

    it('should show an error message on failure', function() {
        const onSubmitMock = jest.fn();
        const operation = new FormImpl({
            id: 'id.testForm',
            values: [formUserText, formPasswordText],
            onSubmit: (bind, done) => onSubmitMock,
        });
        const wrapper = shallow(<FormItemAnt operation={operation} />);
        formUserText.setError('New error');
        expect(wrapper.render()).toMatchSnapshot();
        expect(wrapper.render().find('div.ant-form-explain').length).toBe(1);
    });
});
