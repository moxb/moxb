import { ActionImpl } from '../ActionImpl';

describe('interface BindAction', function() {
    describe('fire', function() {
        it('should be called on fire', function() {
            const fire = jest.fn();
            const bindAction = new ActionImpl({
                id: 'bind.action',
                fire,
            });
            bindAction.fire();
            expect(fire).toHaveBeenCalledTimes(1);
        });
        it('should not be called on fire if disabled', function() {
            const consoleWarn = jest.spyOn(console, 'warn');
            consoleWarn.mockImplementation(() => {});
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
        it('should not be called on fire if disabled and console.warn should be called', function() {
            const consoleWarn = jest.spyOn(console, 'warn');
            consoleWarn.mockImplementation(() => {});
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

        it('should have ActionImpl as `this`', function() {
            let theThis: any = undefined;
            const fire = jest.fn().mockImplementation(function(this: any) {
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
});
