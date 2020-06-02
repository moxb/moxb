import { TimeImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { TimePickerAnt, TimePickerFormAnt } from '../TimePickerAnt';
import { shallowMoxbToJson } from './enzymeHelper';

describe('TimePickerAnt', function() {
    it('should render a time picker by default', function() {
        const operation = new TimeImpl({
            id: 'TheId',
            label: 'oh',
            disabled: () => false,
        });
        expect(shallowMoxbToJson(shallow(<TimePickerAnt operation={operation} />))).toMatchSnapshot();
    });
    it('should return null if invisible', function() {
        const operation = new TimeImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(shallow(<TimePickerAnt operation={operation} />).type()).toBeNull();
    });
});

describe('TimePickerFormAnt', function() {
    it('should render form item with a time picker by default', function() {
        const operation = new TimeImpl({
            id: 'TheId',
            label: 'oh',
            disabled: () => false,
        });
        expect(
            shallowMoxbToJson(
                shallow(
                    <TimePickerFormAnt operation={operation}/>
                )
            )
        ).toMatchSnapshot();
    });
    it('should return null if invisible', function() {
        const operation = new TimeImpl({
            id: 'TheId',
            label: 'oh',
            invisible: () => true,
        });
        expect(
            shallow(
                <TimePickerFormAnt operation={operation}/>
            ).type()
        ).toBeNull();
    });
});
