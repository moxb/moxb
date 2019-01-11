import { TextImpl } from '@moxb/moxb';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { TextAnt, TextFormAnt, TextSearchAnt } from '../TextAnt';

describe('TextAnt', function() {
    it('should render a text input by default', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
            disabled: () => false,
        });
        expect(shallow(<TextAnt operation={operation} />)).toMatchSnapshot();
    });
    it('should render a textarea with the control option set', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
            control: 'textarea',
            disabled: () => false,
        });
        expect(shallow(<TextAnt operation={operation} />)).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(shallow(<TextAnt operation={operation} />).type()).toBeNull();
    });

    it('should call onChange if the input value changes', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
        });
        const wrapper = mount(<TextAnt operation={operation} />);
        const input: any = wrapper.find('input').first();
        input.simulate('change', { target: { value: 'Changed' } });
        expect(
            wrapper
                .find('input')
                .first()
                .prop('value')
        ).toBe('Changed');
    });

    it('should call onChange if the textarea value changes', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
            control: 'textarea',
        });
        const wrapper = mount(<TextAnt operation={operation} />);
        const textarea: any = wrapper.find('textarea').first();
        textarea.simulate('change', { target: { value: 'Changed' } });
        expect(
            wrapper
                .find('textarea')
                .first()
                .prop('value')
        ).toBe('Changed');
    });
});

describe('TextFormAnt', function() {
    it('should render form item with a text input by default', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
            disabled: () => false,
        });
        expect(shallow(<TextFormAnt operation={operation} />)).toMatchSnapshot();
    });
    it('should return null if invisible', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(shallow(<TextFormAnt operation={operation} />).type()).toBeNull();
    });
    it('should call onChange if the input value changes', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
        });
        const wrapper = mount(<TextAnt operation={operation} />);
        const input: any = wrapper.find('input').first();
        input.simulate('change', { target: { value: 'Changed' } });
        expect(
            wrapper
                .find('input')
                .first()
                .prop('value')
        ).toBe('Changed');
    });
});

describe('TextSearchAnt', function() {
    it('should render search text input by default', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
            disabled: () => false,
        });
        expect(shallow(<TextSearchAnt operation={operation} />)).toMatchSnapshot();
    });
    it('should return null if invisible', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(shallow(<TextSearchAnt operation={operation} />).type()).toBeNull();
    });
    it('should call onChange if the input value changes', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
        });
        const wrapper = mount(<TextSearchAnt operation={operation} />);
        const input: any = wrapper.find('input').first();
        input.simulate('change', { target: { value: 'Changed' } });
        expect(
            wrapper
                .find('input')
                .first()
                .prop('value')
        ).toBe('Changed');
    });
});
