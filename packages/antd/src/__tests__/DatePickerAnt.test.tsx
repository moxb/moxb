import { DateImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DatePickerAnt, DatePickerFormAnt } from '../DatePickerAnt';

describe('DatePickerAnt', function() {
    it('should render a date picker by default', function() {
        const operation = new DateImpl({
            id: 'TheId',
            label: 'oh',
            disabled: () => false,
        });
        expect(shallow(<DatePickerAnt operation={operation} />)).toMatchSnapshot();
    });
    it('should return null if invisible', function() {
        const operation = new DateImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(shallow(<DatePickerAnt operation={operation} />).type()).toBeNull();
    });
});

describe('DatePickerFormAnt', function() {
    it('should render form item with a date picker by default', function() {
        const operation = new DateImpl({
            id: 'TheId',
            label: 'oh',
            disabled: () => false,
        });
        expect(shallow(<DatePickerFormAnt operation={operation} />)).toMatchSnapshot();
    });
    it('should return null if invisible', function() {
        const operation = new DateImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(shallow(<DatePickerFormAnt operation={operation} />).type()).toBeNull();
    });
});
