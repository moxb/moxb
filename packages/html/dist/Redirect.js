"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var Redirect = /** @class */ (function (_super) {
    tslib_1.__extends(Redirect, _super);
    function Redirect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Redirect.prototype.componentDidMount = function () {
        var _a = this.props, locationManager = _a.locationManager, _b = _a.position, position = _b === void 0 ? 0 : _b, to = _a.to, updateMethod = _a.updateMethod, pathSaveArg = _a.pathSaveArg, location = _a.location;
        if (location) {
            locationManager.doSetLocation(location, moxb_1.UpdateMethod.REPLACE);
            return;
        }
        if (pathSaveArg) {
            pathSaveArg.doSet(locationManager.location);
        }
        if (to !== undefined) {
            // An empty list is a valid input here, so we can't simply test for falsy
            locationManager.doSetPathTokens(position, to, updateMethod);
        }
    };
    Redirect.prototype.render = function () {
        return React.createElement("div", null, "Redirecting ... ");
    };
    Redirect = tslib_1.__decorate([
        mobx_react_1.inject('locationManager'),
        mobx_react_1.observer
    ], Redirect);
    return Redirect;
}(React.Component));
exports.Redirect = Redirect;
exports.redirect = function (props) { return React.createElement(Redirect, tslib_1.__assign({}, props)); };
exports.redirectTo = function (to) { return exports.redirect({ to: to }); };
function redirectToNavRef(navRef, tokens, updateMethod) {
    var link = navRef.createDirectLink(tokens);
    return exports.redirect({
        to: link.pathTokens,
        updateMethod: updateMethod,
    });
}
exports.redirectToNavRef = redirectToNavRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVkaXJlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUmVkaXJlY3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFvRjtBQUNwRix5Q0FBOEM7QUFDOUMsNkJBQStCO0FBOEIvQjtJQUE4QixvQ0FBNkM7SUFBM0U7O0lBbUJBLENBQUM7SUFsQlUsb0NBQWlCLEdBQXhCO1FBQ1UsSUFBQSxlQUF1RixFQUFyRixvQ0FBZSxFQUFFLGdCQUFZLEVBQVosaUNBQVksRUFBRSxVQUFFLEVBQUUsOEJBQVksRUFBRSw0QkFBVyxFQUFFLHNCQUF1QixDQUFDO1FBQzlGLElBQUksUUFBUSxFQUFFO1lBQ1YsZUFBZ0IsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLG1CQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0QsT0FBTztTQUNWO1FBQ0QsSUFBSSxXQUFXLEVBQUU7WUFDYixXQUFXLENBQUMsS0FBSyxDQUFDLGVBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDaEQ7UUFDRCxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7WUFDbEIseUVBQXlFO1lBQ3pFLGVBQWdCLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDaEU7SUFDTCxDQUFDO0lBRUQseUJBQU0sR0FBTjtRQUNJLE9BQU8sb0RBQTJCLENBQUM7SUFDdkMsQ0FBQztJQWxCUSxRQUFRO1FBRnBCLG1CQUFNLENBQUMsaUJBQWlCLENBQUM7UUFDekIscUJBQVE7T0FDSSxRQUFRLENBbUJwQjtJQUFELGVBQUM7Q0FBQSxBQW5CRCxDQUE4QixLQUFLLENBQUMsU0FBUyxHQW1CNUM7QUFuQlksNEJBQVE7QUFxQlIsUUFBQSxRQUFRLEdBQUcsVUFBQyxLQUFvQixJQUFLLE9BQUEsb0JBQUMsUUFBUSx1QkFBSyxLQUFLLEVBQUksRUFBdkIsQ0FBdUIsQ0FBQztBQUU3RCxRQUFBLFVBQVUsR0FBRyxVQUFDLEVBQVksSUFBSyxPQUFBLGdCQUFRLENBQUMsRUFBRSxFQUFFLElBQUEsRUFBRSxDQUFDLEVBQWhCLENBQWdCLENBQUM7QUFFN0QsU0FBZ0IsZ0JBQWdCLENBQzVCLE1BQXlCLEVBQ3pCLE1BQWtCLEVBQ2xCLFlBQTJCO0lBRTNCLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxPQUFPLGdCQUFRLENBQUM7UUFDWixFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVU7UUFDbkIsWUFBWSxjQUFBO0tBQ2YsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVZELDRDQVVDIn0=