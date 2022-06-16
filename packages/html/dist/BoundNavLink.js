"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var NavLink_1 = require("./NavLink");
var BoundNavLink = /** @class */ (function (_super) {
    tslib_1.__extends(BoundNavLink, _super);
    function BoundNavLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoundNavLink.prototype.render = function () {
        var _a = this.props, operation = _a.operation, children = _a.children, rest = tslib_1.__rest(_a, ["operation", "children"]);
        if (operation.invisible) {
            return null;
        }
        var linkProps = tslib_1.__assign({ to: operation.to, argChanges: operation.argChanges, position: operation.position, appendTokens: operation.appendTokens, removeTokenCount: operation.removeTokenCount, label: operation.label, toRef: operation.toRef, title: operation.help, disabled: moxb_1.readDecision(operation.disabled) }, rest);
        return React.createElement(NavLink_1.NavLink, tslib_1.__assign({}, linkProps), children);
    };
    BoundNavLink = tslib_1.__decorate([
        mobx_react_1.observer
    ], BoundNavLink);
    return BoundNavLink;
}(React.Component));
exports.BoundNavLink = BoundNavLink;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm91bmROYXZMaW5rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0JvdW5kTmF2TGluay50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXFEO0FBQ3JELHlDQUFzQztBQUN0Qyw2QkFBK0I7QUFDL0IscUNBQWlFO0FBVWpFO0lBQWtDLHdDQUFrQztJQUFwRTs7SUF1QkEsQ0FBQztJQXRCRyw2QkFBTSxHQUFOO1FBQ0ksSUFBTSxlQUE2QyxFQUEzQyx3QkFBUyxFQUFFLHNCQUFRLEVBQUUsb0RBQXNCLENBQUM7UUFFcEQsSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxJQUFNLFNBQVMsc0JBQ1gsRUFBRSxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQ2hCLFVBQVUsRUFBRSxTQUFTLENBQUMsVUFBVSxFQUNoQyxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFDNUIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQ3BDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsRUFDNUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQ3RCLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxFQUN0QixLQUFLLEVBQUUsU0FBUyxDQUFDLElBQUksRUFDckIsUUFBUSxFQUFFLG1CQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUN2QyxJQUFJLENBQ1YsQ0FBQztRQUVGLE9BQU8sb0JBQUMsaUJBQU8sdUJBQUssU0FBUyxHQUFHLFFBQVEsQ0FBVyxDQUFDO0lBQ3hELENBQUM7SUF0QlEsWUFBWTtRQUR4QixxQkFBUTtPQUNJLFlBQVksQ0F1QnhCO0lBQUQsbUJBQUM7Q0FBQSxBQXZCRCxDQUFrQyxLQUFLLENBQUMsU0FBUyxHQXVCaEQ7QUF2Qlksb0NBQVkifQ==