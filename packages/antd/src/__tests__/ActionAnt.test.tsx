import { ActionImpl } from '@moxb/moxb';
import * as React from 'react';
import { ActionButtonAnt } from '../ActionAnt';
const ReactTestRenderer = require('react-test-renderer');

describe('ActionFormButtonAnt', function() {
    it('should render', function() {
        const operation = new ActionImpl({
            id: 'TheId',
            fire: jest.fn(),
            label: 'aha',
            disabled: () => true,
        });

        expect(ReactTestRenderer.create(<ActionButtonAnt operation={operation} />)).toMatchSnapshot();
    });
});
