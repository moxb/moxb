import { BoolImpl } from '@moxb/moxb';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { BoolAnt, BoolFormAnt } from '../BoolAnt';

describe('BoolAnt', function() {
    it('should render a checkbox by default', function() {
        const operation = new BoolImpl({
            id: 'TheId',
            label: 'oh',
        });
        expect(shallow(<BoolAnt operation={operation} />)).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new BoolImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(shallow(<BoolAnt operation={operation} />).type()).toBeNull();
    });

    it('should call onChange if the input value changes', function() {
        const operation = new BoolImpl({
            id: 'TheId',
            label: 'oh',
        });
        const wrapper = mount(<BoolAnt operation={operation} />);
        const input: any = wrapper.find('input').first();
        input.simulate('change', { target: { checked: true } });
        expect(
            wrapper
                .find('input')
                .first()
                .prop('checked')
        ).toBe(true);
    });
});

describe('BoolFormAnt', function() {
    it('should render a checkbox by default', function() {
        const operation = new BoolImpl({
            id: 'TheId',
            label: 'oh',
        });
        expect(shallow(<BoolFormAnt operation={operation} />)).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new BoolImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(shallow(<BoolFormAnt operation={operation} />).type()).toBeNull();
    });
});
