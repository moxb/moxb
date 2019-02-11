import { ManyOfImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ManyOfAnt, ManyOfCheckboxAnt, ManyOfFormAnt } from '../ManyOfAnt';
import { shallowMoxbToJson } from './enzymeHelper';

const manyChoices: any[] = [];
const allChoices = [{ label: 'Banana', value: 'b' }, { label: 'Apples', value: 'a' }, { label: 'Peaches', value: 'p' }];

describe('ManyOfAnt', function() {
    it('should render a select control by default', function() {
        const operation = new ManyOfImpl({
            id: 'Id.manyOf',
            label: 'Choose your snack',
            choices: () => allChoices,
            initialValue: () => manyChoices,
            placeholder: () => 'Please select',
            onSave: () => {},
        });
        expect(shallowMoxbToJson(shallow(<ManyOfAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new ManyOfImpl({
            id: 'Id.manyOf',
            label: 'Choose your snack',
            choices: () => allChoices,
            initialValue: () => manyChoices,
            placeholder: () => 'Please select',
            onSave: () => {},
            invisible: () => true,
        });
        expect(shallow(<ManyOfAnt operation={operation} />).type()).toBeNull();
    });
});

describe('ManyOfCheckboxAnt', function() {
    it('should render a checkboxes by default', function() {
        const operation = new ManyOfImpl({
            id: 'Id.manyOf',
            label: 'Choose your snack',
            choices: () => allChoices,
            initialValue: () => manyChoices,
            placeholder: () => 'Please select',
            onSave: () => {},
        });
        expect(shallowMoxbToJson(shallow(<ManyOfCheckboxAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new ManyOfImpl({
            id: 'Id.manyOf',
            label: 'Choose your snack',
            choices: () => allChoices,
            initialValue: () => manyChoices,
            placeholder: () => 'Please select',
            onSave: () => {},
            invisible: () => true,
        });
        expect(shallow(<ManyOfCheckboxAnt operation={operation} />).type()).toBeNull();
    });
});

describe('ManyOfFormAnt', function() {
    it('should render a checkboxes by default', function() {
        const operation = new ManyOfImpl({
            id: 'Id.manyOf',
            label: 'Choose your snack',
            choices: () => allChoices,
            initialValue: () => manyChoices,
            placeholder: () => 'Please select',
            onSave: () => {},
        });
        expect(shallowMoxbToJson(shallow(<ManyOfFormAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new ManyOfImpl({
            id: 'Id.manyOf',
            label: 'Choose your snack',
            choices: () => allChoices,
            initialValue: () => manyChoices,
            placeholder: () => 'Please select',
            onSave: () => {},
            invisible: () => true,
        });
        expect(shallow(<ManyOfFormAnt operation={operation} />).type()).toBeNull();
    });
});
