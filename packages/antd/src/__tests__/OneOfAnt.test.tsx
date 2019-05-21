import { OneOfImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    OneOfAnt,
    OneOfFormAnt,
    OneOfSelectAnt,
    OneOfSelectFormAnt,
    OneOfDropDownAnt,
    OneOfDropDownFormAnt,
} from '../OneOfAnt';
import { shallowMoxbToJson } from './enzymeHelper';

const allChoices = [{ label: 'Banana', value: 'b' }, { label: 'Apples', value: 'a' }, { label: 'Peaches', value: 'p' }];

describe('OneOfAnt', function() {
    it('should render a radio button group by default', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
        });
        expect(shallowMoxbToJson(shallow(<OneOfAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
            invisible: () => true,
        });
        expect(shallow(<OneOfAnt operation={operation} />).type()).toBeNull();
    });
});

describe('OneOfFormAnt', function() {
    it('should render a radio button group with form by default', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
        });
        expect(shallowMoxbToJson(shallow(<OneOfFormAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
            invisible: () => true,
        });
        expect(shallow(<OneOfFormAnt operation={operation} />).type()).toBeNull();
    });
});

describe('OneOfSelectAnt', function() {
    it('should render a select control', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
        });
        expect(shallowMoxbToJson(shallow(<OneOfSelectAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
            invisible: () => true,
        });
        expect(shallow(<OneOfSelectAnt operation={operation} />).type()).toBeNull();
    });
});

describe('OneOfSelectFormAnt', function() {
    it('should render a select control with form', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
        });
        expect(shallowMoxbToJson(shallow(<OneOfSelectFormAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
            invisible: () => true,
        });
        expect(shallow(<OneOfSelectFormAnt operation={operation} />).type()).toBeNull();
    });
});

describe('OneOfDropDownAnt', function() {
    it('should render a dropdown control', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
        });
        expect(shallowMoxbToJson(shallow(<OneOfDropDownAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
            invisible: () => true,
        });
        expect(shallow(<OneOfDropDownAnt operation={operation} />).type()).toBeNull();
    });
});

describe('OneOfDropDownFormAnt', function() {
    it('should render a dropdown control with form', function() {
        const operation = new OneOfImpl({
            id: 'id.testDropDownOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
        });
        expect(shallowMoxbToJson(shallow(<OneOfDropDownFormAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new OneOfImpl({
            id: 'id.testDropDownOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
            invisible: () => true,
        });
        expect(shallow(<OneOfDropDownFormAnt operation={operation} />).type()).toBeNull();
    });
});
