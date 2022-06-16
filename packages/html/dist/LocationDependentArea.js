"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var rendering_1 = require("./rendering");
var LocationDependentArea = /** @class */ (function (_super) {
    tslib_1.__extends(LocationDependentArea, _super);
    function LocationDependentArea(props) {
        var _this = _super.call(this, props) || this;
        var id = props.id, part = props.part, fallback = props.fallback, mountAll = props.mountAll, useTokenMappings = props.useTokenMappings, remnantProps = tslib_1.__rest(props, ["id", "part", "fallback", "mountAll", "useTokenMappings"]);
        _this._states = new moxb_1.LocationDependentStateSpaceHandlerImpl(tslib_1.__assign(tslib_1.__assign({}, remnantProps), { id: 'changing content of ' + id, intercept: true }));
        return _this;
    }
    LocationDependentArea.prototype.componentDidMount = function () {
        if (this.props.useTokenMappings) {
            this._states.registerTokenMappings();
        }
    };
    LocationDependentArea.prototype.componentWillUnmount = function () {
        if (this.props.useTokenMappings) {
            this._states.unregisterTokenMappings();
        }
    };
    LocationDependentArea.prototype.debugLog = function () {
        var _a;
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        if (this.props.debug) {
            (_a = console).log.apply(_a, messages);
        }
    };
    LocationDependentArea.prototype.renderSubState = function (subState, invisible) {
        var _this = this;
        var _a = this.props, navControl = _a.navControl, id = _a.id;
        var extraProps = {
            key: subState ? subState.key : 'missing',
        };
        if (invisible) {
            extraProps.invisible = true;
        }
        var parentName = 'LocationDependentArea:' + id + ':' + (subState ? subState.menuKey : 'null');
        return rendering_1.renderSubStateCore({
            state: subState,
            navigationContext: this.props,
            tokenIncrease: subState ? subState.totalPathTokens.length : 1,
            checkCondition: false,
            extraProps: extraProps,
            navControl: {
                getParentName: function () { return parentName; },
                getAncestorNames: function () { return tslib_1.__spreadArrays((navControl ? navControl.getAncestorNames() : []), [parentName]); },
                isActive: function () {
                    return (!navControl || navControl.isActive()) && // Is the whole area active?
                        !!subState && // The fallback is never really considered to be active
                        _this._states.isSubStateActive(subState);
                },
                registerStateHooks: function (hooks, componentId) {
                    return _this._states.registerNavStateHooksForSubState(subState, hooks, componentId);
                },
                unregisterStateHooks: function (componentId) {
                    return _this._states.unregisterNavStateHooksForSubState(subState, componentId);
                },
            },
        });
    };
    LocationDependentArea.prototype.render = function () {
        var _this = this;
        var mountAll = this.props.mountAll;
        var wantedChild = this._states.getActiveSubState();
        this.debugLog('wantedChild is', wantedChild);
        if (mountAll && wantedChild) {
            this.debugLog('Rendering all children at once');
            return this._states
                .getFilteredSubStates({
                onlyVisible: false,
                onlyLeaves: true,
                onlySatisfying: true,
                noDisplayOnly: true,
            })
                .map(function (s, i) { return (React.createElement("div", { key: "" + i, style: s !== wantedChild ? { display: 'none' } : s.containerStyle }, _this.renderSubState(s, s !== wantedChild))); });
        }
        else {
            return this.renderSubState(wantedChild);
        }
    };
    LocationDependentArea = tslib_1.__decorate([
        mobx_react_1.inject('locationManager', 'tokenManager'),
        mobx_react_1.observer
    ], LocationDependentArea);
    return LocationDependentArea;
}(React.Component));
exports.LocationDependentArea = LocationDependentArea;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYXRpb25EZXBlbmRlbnRBcmVhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0xvY2F0aW9uRGVwZW5kZW50QXJlYS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBS29CO0FBQ3BCLHlDQUE4QztBQUM5Qyw2QkFBK0I7QUFDL0IseUNBQWlEO0FBMkNqRDtJQUFxRCxpREFBcUQ7SUFHdEcsK0JBQW1CLEtBQTJDO1FBQTlELFlBQ0ksa0JBQU0sS0FBSyxDQUFDLFNBUWY7UUFOVyxJQUFBLGFBQUUsRUFBRSxpQkFBSSxFQUFFLHlCQUFRLEVBQUUseUJBQVEsRUFBRSx5Q0FBZ0IsRUFBRSxnR0FBZSxDQUFXO1FBQ2xGLEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSw2Q0FBc0MsdUNBQ2xELFlBQVksS0FDZixFQUFFLEVBQUUsc0JBQXNCLEdBQUcsRUFBRSxFQUMvQixTQUFTLEVBQUUsSUFBSSxJQUNqQixDQUFDOztJQUNQLENBQUM7SUFFTSxpREFBaUIsR0FBeEI7UUFDSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1NBQ3hDO0lBQ0wsQ0FBQztJQUVNLG9EQUFvQixHQUEzQjtRQUNJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtZQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLENBQUM7U0FDMUM7SUFDTCxDQUFDO0lBRU0sd0NBQVEsR0FBZjs7UUFBZ0Isa0JBQWtCO2FBQWxCLFVBQWtCLEVBQWxCLHFCQUFrQixFQUFsQixJQUFrQjtZQUFsQiw2QkFBa0I7O1FBQzlCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDbEIsQ0FBQSxLQUFDLE9BQWUsQ0FBQSxDQUFDLEdBQUcsV0FBSSxRQUFRLEVBQUU7U0FDckM7SUFDTCxDQUFDO0lBRVMsOENBQWMsR0FB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