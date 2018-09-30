import { TextImpl } from '@moxb/moxb';
import * as React from 'react';
import { TextAnt } from '../TextAnt';
import * as Renderer from 'react-test-renderer';

describe('TextAnt', function() {
    it('should render text by default', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
            disabled: () => false,
        });

        // operation.setError('oops');
        // expect(ReactTestRenderer.create(<ActionFormButtonAnt operation={operation} />)).toMatchSnapshot();
        expect(Renderer.create(<TextAnt operation={operation} />)).toMatchSnapshot();
    });
    it('should render textarea by default', function() {
        const operation = new TextImpl({
            id: 'TheId',
            label: 'oh',
            control: 'textarea',
            disabled: () => false,
        });

        // operation.setError('oops');
        // expect(ReactTestRenderer.create(<ActionFormButtonAnt operation={operation} />)).toMatchSnapshot();
        expect(Renderer.create(<TextAnt operation={operation} />)).toMatchSnapshot();
    });
});
