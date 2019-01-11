import { ActionImpl } from '@moxb/moxb';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { ActionButtonAnt, ActionFormButtonAnt } from '../ActionAnt';

describe('ActionButtonAnt', function() {
    it('should render a button by default', function() {
        const operation = new ActionImpl({
            id: 'TheId',
            fire: jest.fn(),
            label: 'aha',
            disabled: () => true,
        });
        expect(shallow(<ActionButtonAnt operation={operation} />)).toMatchSnapshot();
    });

    it('should render a button with children instead of a label', function() {
        const operation = new ActionImpl({
            id: 'TheId',
            fire: jest.fn(),
        });
        expect(shallow(<ActionButtonAnt operation={operation}>FooButton</ActionButtonAnt>)).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new ActionImpl({
            id: 'TheId',
            fire: jest.fn(),
            label: 'aha',
            invisible: () => true,
        });
        expect(shallow(<ActionButtonAnt operation={operation} />).type()).toBeNull();
    });

    it('should call fire() if the button was clicked', function() {
        const mockCallBack = jest.fn();
        const operation = new ActionImpl({
            id: 'TheId',
            fire: mockCallBack,
            label: 'aha',
        });
        const button = mount(<ActionButtonAnt operation={operation} />);
        button.find('button').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
    it('should not call fire() if the button was disabled and clicked', function() {
        const mockCallBack = jest.fn();
        const operation = new ActionImpl({
            id: 'TheId',
            fire: mockCallBack,
            label: 'aha',
            disabled: () => true,
        });
        const button = mount(<ActionButtonAnt operation={operation} />);
        button.find('button').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
});

describe('ActionFormButtonAnt', function() {
    it('should render a button by default', function() {
        const operation = new ActionImpl({
            id: 'TheId',
            fire: jest.fn(),
            label: 'aha',
            disabled: () => true,
        });
        expect(shallow(<ActionFormButtonAnt operation={operation} />)).toMatchSnapshot();
    });

    it('should return null if invisible', function() {
        const operation = new ActionImpl({
            id: 'TheId',
            fire: jest.fn(),
            label: 'aha',
            invisible: () => true,
        });
        expect(shallow(<ActionFormButtonAnt operation={operation} />).type()).toBeNull();
    });
});
