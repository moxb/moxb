import { ActionImpl } from '@moxb/moxb';
import { mount, ReactWrapper, shallow } from 'enzyme';
import * as React from 'react';
import { Form } from 'semantic-ui-react';
import { ActionFormButtonUi, ActionUiProps } from '../ActionUi';
import pretty = require('pretty');

describe('ActionFormButtonUi', () => {
    let props: ActionUiProps | undefined;
    let mountedLockScreen: any;
    const component = (): ReactWrapper<any, any> => {
        if (!mountedLockScreen && props) {
            mountedLockScreen = mount(<ActionFormButtonUi {...props} />);
        }
        return mountedLockScreen;
    };

    beforeEach(() => {
        props = undefined;
        mountedLockScreen = undefined;
    });

    afterEach(() => {
        if (mountedLockScreen) {
            mountedLockScreen.unmount();
        }
    });

    it('should have one child', function () {
        props = {
            operation: new ActionImpl({
                id: 'the.id',
                fire: jest.fn(),
            }),
        };
        expect(component().children().length).toBe(1);
        expect(component().find('button').length).toBe(1);
        expect(component().find('div').length).toBe(1);
        expect(shallow(<ActionFormButtonUi {...props} />).find('#the-id').length).toBe(1);
        expect(component().find('#the-id').length).toBeGreaterThan(0);
    });
    it('should match snapshot', function () {
        props = {
            operation: new ActionImpl({
                id: 'TheId',
                fire: jest.fn(),
            }),
        };
        expect(shallow(<ActionFormButtonUi {...props} />)).toMatchSnapshot();
    });
    it('html should match snapshot', function () {
        props = {
            operation: new ActionImpl({
                id: 'Action.id',
                fire: jest.fn(),
                disabled: jest.fn().mockReturnValue(false),
            }),
        };
        // we use pretty to make it multi line...
        expect(pretty(mount(<ActionFormButtonUi {...props} />).html())).toMatchSnapshot();
    });
    it('should fire on button click', function () {
        const fire = jest.fn();
        props = {
            operation: new ActionImpl({
                id: 'TheId',
                fire,
            }),
        };
        shallow(<ActionFormButtonUi {...props} />)
            .find('#the_id')
            .simulate('click');
        expect(fire).toBeCalled();
    });
    it('should call disabled', function () {
        const disabled = jest.fn().mockReturnValue(false);
        props = {
            operation: new ActionImpl({
                id: 'TheId',
                fire: jest.fn(),
                disabled,
            }),
        };
        shallow(<ActionFormButtonUi {...props} />);
        expect(disabled).toBeCalled();
    });
    it('should call enabled', function () {
        const consoleWarn = jest.spyOn(console, 'warn');
        consoleWarn.mockImplementation(() => {
            // this is intentional
        });

        const enabled = jest.fn().mockReturnValue(false);
        const fire = jest.fn().mockReturnValue(false);
        props = {
            operation: new ActionImpl({
                id: 'Action.id',
                fire,
                enabled,
            }),
        };
        const wrapper = shallow(<ActionFormButtonUi {...props} />);
        expect(wrapper.render().find('button.disabled').length).toBe(1);
        expect(enabled).toBeCalled();
        wrapper.find('#action-id').simulate('click');
        expect(fire).not.toBeCalled();
        consoleWarn.mockRestore();
    });
    it('should console.warn if called with enabled', function () {
        const consoleWarn = jest.spyOn(console, 'warn');
        consoleWarn.mockImplementation(() => {
            // this is intentional
        });

        const enabled = jest.fn().mockReturnValue(false);
        props = {
            operation: new ActionImpl({
                id: 'Action.id',
                fire: jest.fn(),
                enabled,
            }),
        };
        const wrapper = shallow(<ActionFormButtonUi {...props} />);
        expect(wrapper.render().find('button.disabled').length).toBe(1);
        expect(enabled).toBeCalled();
        wrapper.find('#action-id').simulate('click');
        expect(consoleWarn).toBeCalled();
        consoleWarn.mockRestore();
    });
    it('should not be disables when enabled is true', function () {
        const enabled = jest.fn().mockReturnValue(true);
        props = {
            operation: new ActionImpl({
                id: 'Action.id',
                fire: jest.fn(),
                enabled,
            }),
        };
        const wrapper = shallow(<ActionFormButtonUi {...props} />);
        expect(wrapper.find(Form.Button).length).toBe(1);
        expect(wrapper.find(Form.Button).render().find('button').length).toBe(1);
        expect(wrapper.render().find('button.disabled').length).toBe(0);
        expect(enabled).toBeCalled();
    });
});
