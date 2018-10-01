import { ActionImpl } from '@moxb/moxb';
import * as React from 'react';
import { ActionFormButtonAnt } from '../ActionAnt';
const ReactTestRenderer = require('react-test-renderer');

describe('ActionFormButtonAnt', function() {
    it('should render', function() {
        const operation = new ActionImpl({
            id: 'TheId',
            fire: jest.fn(),
            label: 'aha',
            disabled: () => true,
        });

        // operation.setError('oops');
        expect(ReactTestRenderer.create(<ActionFormButtonAnt operation={operation} />)).toMatchSnapshot();
        // expect(ReactTestRenderer.create(<ActionFormButtonAntNew operation={operation} />)).toMatchSnapshot();
    });
});
