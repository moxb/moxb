import { BindImpl } from '../../bind/BindImpl';
import { setTFunction, translateKeysOnly } from '../../i18n/i18n';
import { Confirm } from '../Confirm';
import { ConfirmImpl } from '../ConfirmImpl';

describe('content', function() {
    let content = jest.fn();
    let bindConfirm: Confirm<any>;

    beforeEach(function() {
        setTFunction(translateKeysOnly);
        content = jest.fn().mockReturnValue('Content Value');
        bindConfirm = new ConfirmImpl<any>({
            confirmButton: new BindImpl({
                id: 'ok',
            }),
            cancelButton: new BindImpl({
                id: 'cancel',
            }),
            content,
        });
    });
    it('should not be called when not shown', function() {
        expect(bindConfirm.content).toBe('[ConfirmDialog.defaultContent]');
        expect(content).not.toBeCalled();
        bindConfirm.show('data');

        expect(bindConfirm.content).toBe('Content Value');
        expect(content).toBeCalled();

        content.mockReset();
        bindConfirm.onCancel();
        expect(bindConfirm.content).toBe('[ConfirmDialog.defaultContent]');
        expect(content).not.toBeCalled();
    });
    it('should be called when shown', function() {
        bindConfirm.show('data');

        expect(bindConfirm.content).toBe('Content Value');
        expect(content).toBeCalled();
    });
    it('should not be called after canceled', function() {
        bindConfirm.show('data');
        bindConfirm.onCancel();

        expect(bindConfirm.content).toBe('[ConfirmDialog.defaultContent]');
        expect(content).not.toBeCalled();
    });
    it('should not be called after confirmed', function() {
        bindConfirm.show('data');
        bindConfirm.onConfirm();

        expect(bindConfirm.content).toBe('[ConfirmDialog.defaultContent]');
        expect(content).not.toBeCalled();
    });
});
describe('header', function() {
    let header = jest.fn();
    let bindConfirm: Confirm<any>;

    beforeEach(function() {
        header = jest.fn().mockReturnValue('Header Value');
        bindConfirm = new ConfirmImpl<any>({
            confirmButton: new BindImpl({
                id: 'ok',
            }),
            cancelButton: new BindImpl({
                id: 'cancel',
            }),
            header,
        });
    });
    it('should not be called when not shown', function() {
        expect(bindConfirm.header).toBe('');
        expect(header).not.toBeCalled();
        bindConfirm.show('data');

        expect(bindConfirm.header).toBe('Header Value');
        expect(header).toBeCalled();

        header.mockReset();
        bindConfirm.onCancel();
        expect(bindConfirm.header).toBe('');
        expect(header).not.toBeCalled();
    });
    it('should be called when shown', function() {
        bindConfirm.show('data');

        expect(bindConfirm.header).toBe('Header Value');
        expect(header).toBeCalled();
    });
    it('should not be called after canceled', function() {
        bindConfirm.show('data');
        bindConfirm.onCancel();

        expect(bindConfirm.header).toBe('');
        expect(header).not.toBeCalled();
    });
    it('should not be called after confirmed', function() {
        bindConfirm.show('data');
        bindConfirm.onConfirm();

        expect(bindConfirm.header).toBe('');
        expect(header).not.toBeCalled();
    });
});
