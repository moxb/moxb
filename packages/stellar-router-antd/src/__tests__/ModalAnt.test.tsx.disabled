import { ActionImpl, ModalImpl, ModalActions } from '@moxb/moxb';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ModalAnt } from '../ModalAnt';
import { shallowMoxbToJson } from './enzymeHelper';

interface CustomModalActions extends ModalActions {
    test1: string;
    test2: string;
}

describe('ModalAnt', function () {
    it('should render a modal dialog by default', function () {
        const operation = new ModalImpl<any, ModalActions>({
            actions: () => ({
                cancel: new ActionImpl({
                    id: 'Id.btn',
                    label: 'Action',
                    fire: jest.fn(),
                }),
                confirm: new ActionImpl({
                    id: 'Id.btn1',
                    label: 'Cancel',
                    fire: jest.fn(),
                }),
            }),
            header: () => 'New Modal Header',
        });
        expect(shallowMoxbToJson(shallow(<ModalAnt operation={operation} />))).toMatchSnapshot();
    });

    it('should support a custom footer', function () {
        const operation = new ModalImpl<any, CustomModalActions>({
            actions: () => ({
                cancel: new ActionImpl({
                    id: 'Id.btn',
                    label: 'Action',
                    fire: jest.fn(),
                }),
                test1: 'Hello',
                test2: 'World',
            }),
            header: () => 'New Modal Header',
        });
        expect(
            shallowMoxbToJson(
                shallow(
                    <ModalAnt
                        operation={operation}
                        footer={(actions) => <div>{`${actions.test1} ${actions.test2}`}</div>}
                    />
                )
            )
        ).toMatchSnapshot();
    });
});
