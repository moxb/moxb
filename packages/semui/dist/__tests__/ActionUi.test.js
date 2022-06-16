"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var enzyme_1 = require("enzyme");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var ActionUi_1 = require("../ActionUi");
var pretty = require("pretty");
describe('ActionFormButtonUi', function () {
    var props;
    var mountedLockScreen;
    var component = function () {
        if (!mountedLockScreen && props) {
            mountedLockScreen = enzyme_1.mount(React.createElement(ActionUi_1.ActionFormButtonUi, tslib_1.__assign({}, props)));
        }
        return mountedLockScreen;
    };
    beforeEach(function () {
        props = undefined;
        mountedLockScreen = undefined;
    });
    afterEach(function () {
        if (mountedLockScreen) {
            mountedLockScreen.unmount();
        }
    });
    it('should have one child', function () {
        props = {
            operation: new moxb_1.ActionImpl({
                id: 'the.id',
                fire: jest.fn(),
            }),
        };
        expect(component().children().length).toBe(1);
        expect(component().find('button').length).toBe(1);
        expect(component().find('div').length).toBe(1);
        expect(enzyme_1.shallow(React.createElement(ActionUi_1.ActionFormButtonUi, tslib_1.__assign({}, props))).find('#the-id').length).toBe(1);
        expect(component().find('#the-id').length).toBeGreaterThan(0);
    });
    it('should match snapshot', function () {
        props = {
            operation: new moxb_1.ActionImpl({
                id: 'TheId',
                fire: jest.fn(),
            }),
        };
        expect(enzyme_1.shallow(React.createElement(ActionUi_1.ActionFormButtonUi, tslib_1.__assign({}, props)))).toMatchSnapshot();
    });
    it('html should match snapshot', function () {
        props = {
            operation: new moxb_1.ActionImpl({
                id: 'Action.id',
                fire: jest.fn(),
                disabled: jest.fn().mockReturnValue(false),
            }),
        };
        // we use pretty to make it multi line...
        expect(pretty(enzyme_1.mount(React.createElement(ActionUi_1.ActionFormButtonUi, tslib_1.__assign({}, props))).html())).toMatchSnapshot();
    });
    it('should fire on button click', function () {
        var fire = jest.fn();
        props = {
            operation: new moxb_1.ActionImpl({
                id: 'TheId',
                fire: fire,
            }),
        };
        enzyme_1.shallow(React.createElement(ActionUi_1.ActionFormButtonUi, tslib_1.__assign({}, props)))
            .find('#the_id')
            .simulate('click');
        expect(fire).toBeCalled();
    });
    it('should call disabled', function () {
        var disabled = jest.fn().mockReturnValue(false);
        props = {
            operation: new moxb_1.ActionImpl({
                id: 'TheId',
                fire: jest.fn(),
                disabled: disabled,
            }),
        };
        enzyme_1.shallow(React.createElement(ActionUi_1.ActionFormButtonUi, tslib_1.__assign({}, props)));
        expect(disabled).toBeCalled();
    });
    it('should call enabled', function () {
        var consoleWarn = jest.spyOn(console, 'warn');
        consoleWarn.mockImplementation(function () { });
        var enabled = jest.fn().mockReturnValue(false);
        var fire = jest.fn().mockReturnValue(false);
        props = {
            operation: new moxb_1.ActionImpl({
                id: 'Action.id',
                fire: fire,
                enabled: enabled,
            }),
        };
        var wrapper = enzyme_1.shallow(React.createElement(ActionUi_1.ActionFormButtonUi, tslib_1.__assign({}, props)));
        expect(wrapper.render().find('button.disabled').length).toBe(1);
        expect(enabled).toBeCalled();
        wrapper.find('#action-id').simulate('click');
        expect(fire).not.toBeCalled();
        consoleWarn.mockRestore();
    });
    it('should console.warn if called with enabled', function () {
        var consoleWarn = jest.spyOn(console, 'warn');
        consoleWarn.mockImplementation(function () { });
        var enabled = jest.fn().mockReturnValue(false);
        props = {
            operation: new moxb_1.ActionImpl({
                id: 'Action.id',
                fire: jest.fn(),
                enabled: enabled,
            }),
        };
        var wrapper = enzyme_1.shallow(React.createElement(ActionUi_1.ActionFormButtonUi, tslib_1.__assign({}, props)));
        expect(wrapper.render().find('button.disabled').length).toBe(1);
        expect(enabled).toBeCalled();
        wrapper.find('#action-id').simulate('click');
        expect(consoleWarn).toBeCalled();
        consoleWarn.mockRestore();
    });
    it('should not be disables when enabled is true', function () {
        var enabled = jest.fn().mockReturnValue(true);
        props = {
            operation: new moxb_1.ActionImpl({
                id: 'Action.id',
                fire: jest.fn(),
                enabled: enabled,
            }),
        };
        var wrapper = enzyme_1.shallow(React.createElement(ActionUi_1.ActionFormButtonUi, tslib_1.__assign({}, props)));
        expect(wrapper.find(semantic_ui_react_1.Form.Button).length).toBe(1);
        expect(wrapper.find(semantic_ui_react_1.Form.Button).render().find('button').length).toBe(1);
        expect(wrapper.render().find('button.disabled').length).toBe(0);
        expect(enabled).toBeCalled();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9uVWkudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vQWN0aW9uVWkudGVzdC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXdDO0FBQ3hDLGlDQUFzRDtBQUN0RCw2QkFBK0I7QUFDL0IsdURBQXlDO0FBQ3pDLHdDQUFnRTtBQUNoRSwrQkFBa0M7QUFFbEMsUUFBUSxDQUFDLG9CQUFvQixFQUFFO0lBQzNCLElBQUksS0FBZ0MsQ0FBQztJQUNyQyxJQUFJLGlCQUFzQixDQUFDO0lBQzNCLElBQU0sU0FBUyxHQUFHO1FBQ2QsSUFBSSxDQUFDLGlCQUFpQixJQUFJLEtBQUssRUFBRTtZQUM3QixpQkFBaUIsR0FBRyxjQUFLLENBQUMsb0JBQUMsNkJBQWtCLHVCQUFLLEtBQUssRUFBSSxDQUFDLENBQUM7U0FDaEU7UUFDRCxPQUFPLGlCQUFpQixDQUFDO0lBQzdCLENBQUMsQ0FBQztJQUVGLFVBQVUsQ0FBQztRQUNQLEtBQUssR0FBRyxTQUFTLENBQUM7UUFDbEIsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDO1FBQ04sSUFBSSxpQkFBaUIsRUFBRTtZQUNuQixpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMvQjtJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVCQUF1QixFQUFFO1FBQ3hCLEtBQUssR0FBRztZQUNKLFNBQVMsRUFBRSxJQUFJLGlCQUFVLENBQUM7Z0JBQ3RCLEVBQUUsRUFBRSxRQUFRO2dCQUNaLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO2FBQ2xCLENBQUM7U0FDTCxDQUFDO1FBQ0YsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsU0FBUyxFQUFF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