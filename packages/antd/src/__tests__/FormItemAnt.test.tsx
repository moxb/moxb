import { FormImpl, TextImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FormItemAnt } from '../FormItemAnt';
import { shallowMoxbToJson } from './enzymeHelper';

describe('FormItemAnt', function() {
    const formUserText = new TextImpl({
        id: 'ApplicationImpl.formUserText',
        label: 'Username',
        onSave: () => jest.fn(),
    });
    const formPasswordText = new TextImpl({
        id: 'ApplicationImpl.formUserText',
        label: 'Username',
        onSave: () => jest.fn(),
    });

    it('should render a form item by default', function() {
        const onSubmitMock = jest.fn();
        const operation = new FormImpl({
            id: 'id.testForm',
            values: [formUserText, formPasswordText],
            onSubmit: () => onSubmitMock,
        });
        expect(
            shallowMoxbToJson(
                shallow(
                    <FormItemAnt operation={operation}>
                        <></>
                    </FormItemAnt>
                )
            )
        ).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const onSubmitMock = jest.fn();
        const operation = new FormImpl({
            id: 'id.testForm',
            values: [formUserText, formPasswordText],
            onSubmit: () => onSubmitMock,
            invisible: () => true,
        });
        expect(
            shallow(
                <FormItemAnt operation={operation}>
                    <></>
                </FormItemAnt>
            ).type()
        ).toBeNull();
    });

    it('should show an error message on failure', function() {
        const onSubmitMock = jest.fn();
        const operation = new FormImpl({
            id: 'id.testForm',
            values: [formUserText, formPasswordText],
            onSubmit: () => onSubmitMock,
        });
        const wrapper = shallow(
            <FormItemAnt operation={operation}>
                <></>
            </FormItemAnt>
        );
        formUserText.setError('New error');
        expect(wrapper.render()).toMatchSnapshot();
        expect(wrapper.render().find('div.ant-form-explain').length).toBe(0);
    });
});
