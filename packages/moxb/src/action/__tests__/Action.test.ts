import { ActionButtonImpl, ActionImpl } from '../ActionImpl';

describe('interface BindAction', function () {
    describe('fire', function () {
        it('should be called on fire', function () {
            const fire = jest.fn();
            const bindAction = new ActionImpl({
                id: 'bind.action',
                fire,
            });
            bindAction.fire();
            expect(fire).toHaveBeenCalledTimes(1);
        });
        it('should not be called on fire if disabled', function () {
            const consoleWarn = jest.spyOn(console, 'warn');
            consoleWarn.mockImplementation(() => {
                // This is intentional
            });
            const fire = jest.fn();
            const bindAction = new ActionImpl({
                id: 'bind.action',
                fire,
                disabled: () => true,
            });
            bindAction.fire();
            expect(fire).not.toHaveBeenCalled();
            consoleWarn.mockRestore();
        });
        it('should not be called on fire if disabled and console.warn should be called', function () {
            const consoleWarn = jest.spyOn(console, 'warn');
            consoleWarn.mockImplementation(() => {
                // This is intentional
            });
            const fire = jest.fn();
            const bindAction = new ActionImpl({
                id: 'bind.action',
                fire,
                disabled: () => true,
            });
            bindAction.fire();
            expect(consoleWarn).toHaveBeenCalled();
            consoleWarn.mockRestore();
        });

        it('should have ActionImpl as `this`', function () {
            let theThis: any = undefined;
            const fire = jest.fn().mockImplementation(function (this: any) {
                theThis = this;
            });
            const bindAction = new ActionImpl({
                id: 'bind.action',
                fire,
            });
            bindAction.fire();
            expect(theThis).toBe(bindAction);
        });
    });

    describe('constructor', function () {
        it('should create an instance of ActionImpl', function () {
            const bindAction = new ActionImpl({
                id: 'bind.action',
                fire: () => {
                    // This is intentional
                },
            });
            expect(bindAction).toBeDefined();
        });

        it('should create an instance of ActionButtonImpl', function () {
            const bindAction = new ActionButtonImpl({
                id: 'bind.action',
                fire: () => {
                    // This is intentional
                },
            });
            expect(bindAction).toBeDefined();
        });
    });
    describe('keyboardShortcuts', function () {
        it('should return empty array if not specified', function () {
            const bindAction = new ActionImpl({
                id: 'bind.action',
                fire: () => {
                    // This is intentional
                },
            });
            expect(bindAction.keyboardShortcuts).toEqual([]);
        });

        it('should return array with one shortcut if a string is given', function () {
            const bindAction = new ActionButtonImpl({
                id: 'bind.action',
                keyboardShortcuts: 'the shortcut',
                fire: () => {
                    // This is intentional
                },
            });
            expect(bindAction.keyboardShortcuts).toEqual(['the shortcut']);
        });
        it('should return array with one shortcut if a n array of string is given', function () {
            const bindAction = new ActionButtonImpl({
                id: 'bind.action',
                keyboardShortcuts: ['cmd 1', 'cmd 2', 'x'],
                fire: () => {
                    // This is intentional
                },
            });
            expect(bindAction.keyboardShortcuts).toEqual(['cmd 1', 'cmd 2', 'x']);
        });
    });
});
