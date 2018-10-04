import { OneOfImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { OneOfAnt, OneOfFormAnt, OneOfSelectAnt, OneOfSelectFormAnt } from '../OneOfAnt';

const allChoices = [{ label: 'Banana', value: 'b' }, { label: 'Apples', value: 'a' }, { label: 'Peaches', value: 'p' }];

describe('OneOfAnt', function() {
    it('should render a radio button group by default', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
        });
        expect(shallow(<OneOfAnt operation={operation} />)).toMatchSnapshot();
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
    it('should render a radio button group by default', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
        });
        expect(shallow(<OneOfFormAnt operation={operation} />)).toMatchSnapshot();
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
    it('should render a select control by default', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
        });
        expect(shallow(<OneOfSelectAnt operation={operation} />)).toMatchSnapshot();
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

describe('OneOfAnt', function() {
    it('should render a select control by default', function() {
        const operation = new OneOfImpl({
            id: 'id.testRadioOfOne',
            label: 'Select one of',
            placeholder: '...',
            choices: () => allChoices,
        });
        expect(shallow(<OneOfSelectFormAnt operation={operation} />)).toMatchSnapshot();
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
