import { NumericImpl } from '@moxb/moxb';
import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { NumericAnt, NumericFormAnt } from '../NumericAnt';

describe('NumericAnt', function() {
    it('should render a numeric input by default', function() {
        const operation = new NumericImpl({
            id: 'TheId',
            label: 'oh',
            disabled: () => false,
        });
        expect(shallow(<NumericAnt operation={operation} />)).toMatchSnapshot();
    });
    it('should return null if invisible', function() {
        const operation = new NumericImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(shallow(<NumericAnt operation={operation} />).type()).toBeNull();
    });

    it('should call onChange if the input value changes', function() {
        const operation = new NumericImpl({
            id: 'TheId',
            label: 'oh',
        });
        const wrapper = mount(<NumericAnt operation={operation} />);
        const input: any = wrapper.find('input').first();
        input.simulate('change', { target: { value: '123' } });
        expect(
            wrapper
                .find('input')
                .first()
                .prop('value')
        ).toBe('123');
    });
});

describe('NumericFormAnt', function() {
    it('should render form item with a text input by default', function() {
        const operation = new NumericImpl({
            id: 'TheId',
            label: 'oh',
            initialValue: 12,
            disabled: () => false,
        });
        expect(shallow(<NumericFormAnt operation={operation} />)).toMatchSnapshot();
    });
    it('should return null if invisible', function() {
        const operation = new NumericImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(shallow(<NumericFormAnt operation={operation} />).type()).toBeNull();
    });
});
