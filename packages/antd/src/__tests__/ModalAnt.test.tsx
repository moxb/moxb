import { ActionImpl, ModalImpl } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ModalAnt } from '../ModalAnt';
import { shallowMoxbToJson } from './enzymeHelper';

describe('ModalAnt', function() {
    it('should render a modal dialog by default', function() {
        const operation = new ModalImpl<any>({
            actions: () => [
                new ActionImpl({
                    id: 'Id.btn',
                    label: 'Action',
                    fire: jest.fn(),
                }),
                new ActionImpl({
                    id: 'Id.btn1',
                    label: 'Cancel',
                    fire: jest.fn(),
                }),
            ],
            header: () => 'New Modal Header',
        });
        expect(shallowMoxbToJson(shallow(<ModalAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should return null and print a warning, if only one button was defined', function() {
        const operation = new ModalImpl<any>({
            actions: () => [
                new ActionImpl({
                    id: 'Id.btn',
                    label: 'Action',
                    fire: jest.fn(),
                }),
            ],
            header: () => 'New Modal Header',
        });
        const consoleWarn = jest.spyOn(console, 'warn');
        consoleWarn.mockImplementation(() => {});
        expect(shallow(<ModalAnt operation={operation} />).type()).toBeNull();
        expect(consoleWarn).toHaveBeenCalledTimes(1);
        consoleWarn.mockRestore();
    });
});
