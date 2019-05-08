import { Action } from '../../action/Action';
import { ActionImpl } from '../../action/ActionImpl';
import { Modal } from '../Modal';
import { ModalImpl } from '../ModalImpl';

describe('header', function() {
    let header = jest.fn();
    let bindModal: Modal<any, any>;

    beforeEach(function() {
        header = jest.fn().mockReturnValue('Header Value');
        bindModal = new ModalImpl<any, any>({ header, actions: () => ({ cancel: null }) });
    });
    it('should not be called when not shown', function() {
        expect(bindModal.header).toBe('');
        expect(header).not.toBeCalled();
        bindModal.show();

        expect(bindModal.header).toBe('Header Value');
        expect(header).toBeCalled();

        header.mockReset();
        bindModal.close();
        expect(bindModal.header).toBe('');
        expect(header).not.toBeCalled();
    });
    it('should be called when shown', function() {
        bindModal.show('data');

        expect(bindModal.header).toBe('Header Value');
        expect(header).toBeCalled();
    });
    it('should not be called after closing', function() {
        bindModal.show('data');
        bindModal.close();

        expect(bindModal.header).toBe('');
        expect(header).not.toBeCalled();
    });
});

describe('actions', function() {
    let actions = jest.fn();
    let bindModal: Modal<any, any>;
    let testAction: Action;
    let fire: any;

    beforeEach(function() {
        fire = jest.fn();
        testAction = new ActionImpl({
            id: 'action',
            fire,
        });
        actions = jest.fn().mockReturnValue([testAction]);
        bindModal = new ModalImpl<any, any>({
            actions,
        });
    });
    it('should be contain BindActions and be callable actions', function() {
        expect(bindModal.actions).toEqual([testAction]);
        expect(actions).toBeCalled();
        bindModal.show();

        testAction.fire();
        expect(fire).toHaveBeenCalledTimes(1);
        expect(fire).toBeCalled();
    });
    it('should be of type BindAction', function() {
        expect(bindModal.actions).toEqual([testAction]);
        expect(bindModal.actions![0]).toBeInstanceOf(ActionImpl);
        expect(bindModal.actions![0].fire).toBeDefined();
    });
});

describe('open', function() {
    let bindModal: Modal<any, any>;

    beforeEach(function() {
        bindModal = new ModalImpl<any, any>({ actions: () => ({ cancel: null }) });
    });
    it('should be true, if the modal is shown', function() {
        expect(bindModal.open).toBe(false);
        bindModal.show();
        expect(bindModal.open).toBe(true);
    });
    it('should be false, if the modal is closed', function() {
        expect(bindModal.open).toBe(false);
        bindModal.show();
        bindModal.close();
        expect(bindModal.open).toBe(false);
    });
});

describe('data', function() {
    let bindModal: Modal<any, any>;

    beforeEach(function() {
        bindModal = new ModalImpl<any, any>({
            header: data => data,
            actions: data => [data],
        });
    });
    it('should be set via the show function', function() {
        bindModal.show('data');
        expect(bindModal.data).toBe('data');
    });

    it('should be available to the header property', function() {
        bindModal.show('data');
        expect(bindModal.header).toBe('data');
    });

    it('should be available to the actions property', function() {
        bindModal.show('data');
        expect(bindModal.actions).toEqual(['data']);
    });
});
