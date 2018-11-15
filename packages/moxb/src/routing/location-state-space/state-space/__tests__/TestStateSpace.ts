import { StateSpace } from '../StateSpace';

export interface TestData {
    secret: boolean;
}

export const testStateSpace: StateSpace<string, any, TestData> = [
    {
        label: 'Root state',
        root: true,
    },
    {
        key: 'foo',
        label: 'Foo',
    },
    {
        key: 'bar',
        label: 'Bar',
        hidden: true, // this won't be listed in a menu
    },
    {
        key: 'group1',
        label: 'Group 1',
        subStates: [
            {
                key: 'child1',
                label: 'Child 1',
            },
            {
                key: 'child2',
                label: 'Child 2',
            },
            {
                root: true,
                label: 'Group 1 Root',
            },
        ],
    },
    {
        key: 'group2',
        label: 'Group 2',
        flat: true, // This is a flat group, so the sub-states will appear in the same level
        subStates: [
            {
                key: 'child3',
                label: 'Child 3',
            },
            {
                key: 'child4',
                label: 'Child 4',
                data: {
                    secret: true,
                },
            },
        ],
    },
];

describe('the description of the state-spaces and sub-states', () => {
    it('should look nice', () => {
        expect(true).toBeTruthy();
    });
});
