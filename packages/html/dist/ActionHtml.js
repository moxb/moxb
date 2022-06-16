"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var BindHtml_1 = require("./BindHtml");
var ActionButtonHtml = /** @class */ (function (_super) {
    tslib_1.__extends(ActionButtonHtml, _super);
    function ActionButtonHtml() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionButtonHtml.prototype.render = function () {
        var _a = BindHtml_1.parseHtmlProps(this.props, this.props.operation), operation = _a.operation, invisible = _a.invisible, children = _a.children, label = _a.label, id = _a.id, props = tslib_1.__rest(_a, ["operation", "invisible", "children", "label", "id"]);
        if (invisible || operation.invisible) {
            return null;
        }
        return (React.createElement("button", tslib_1.__assign({ id: id, onClick: operation.fire }, props), children != null ? children : label));
    };
    ActionButtonHtml = tslib_1.__decorate([
        mobx_react_1.observer
    ], ActionButtonHtml);
    return ActionButtonHtml;
}(React.Component));
exports.ActionButtonHtml = ActionButtonHtml;
var ActionAnchorHtml = /** @class */ (function (_super) {
    tslib_1.__extends(ActionAnchorHtml, _super);
    function ActionAnchorHtml() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionAnchorHtml.prototype.render = function () {
        var _a = BindHtml_1.parseHtmlProps(this.props, this.props.operation), operation = _a.operation, invisible = _a.invisible, children = _a.children, label = _a.label, id = _a.id, props = tslib_1.__rest(_a, ["operation", "invisible", "children", "label", "id"]);
        if (invisible || operation.invisible) {
            return null;
        }
        return (React.createElement("a", tslib_1.__assign({ id: id, onClick: operation.fire }, props), children != null ? children : label));
    };
    ActionAnchorHtml = tslib_1.__decorate([
        mobx_react_1.observer
    ], ActionAnchorHtml);
    return ActionAnchorHtml;
}(React.Component));
exports.ActionAnchorHtml = ActionAnchorHtml;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9uSHRtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rpb25IdG1sLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5Q0FBc0M7QUFDdEMsNkJBQStCO0FBQy9CLHVDQUEyRDtBQUczRDtJQUFzQyw0Q0FBMEQ7SUFBaEc7O0lBZUEsQ0FBQztJQWRHLGlDQUFNLEdBQU47UUFDSSxJQUFNLGdFQUdMLEVBSE8sd0JBQVMsRUFBRSx3QkFBUyxFQUFFLHNCQUFRLEVBQUUsZ0JBQUssRUFBRSxVQUFFLEVBQUUsaUZBR2xELENBQUM7UUFDRixJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLENBQ0gsaURBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLElBQUksSUFBTyxLQUFhLEdBQ3RELFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUMvQixDQUNaLENBQUM7SUFDTixDQUFDO0lBZFEsZ0JBQWdCO1FBRDVCLHFCQUFRO09BQ0ksZ0JBQWdCLENBZTVCO0lBQUQsdUJBQUM7Q0FBQSxBQWZELENBQXNDLEtBQUssQ0FBQyxTQUFTLEdBZXBEO0FBZlksNENBQWdCO0FBa0I3QjtJQUFzQyw0Q0FBMEQ7SUFBaEc7O0lBZUEsQ0FBQztJQWRHLGlDQUFNLEdBQU47UUFDSSxJQUFNLGdFQUdMLEVBSE8sd0JBQVMsRUFBRSx3QkFBUyxFQUFFLHNCQUFRLEVBQUUsZ0JBQUssRUFBRSxVQUFFLEVBQUUsaUZBR2xELENBQUM7UUFDRixJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLENBQ0gsNENBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLElBQUksSUFBTyxLQUFhLEdBQ2pELFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUNwQyxDQUNQLENBQUM7SUFDTixDQUFDO0lBZFEsZ0JBQWdCO1FBRDVCLHFCQUFRO09BQ0ksZ0JBQWdCLENBZTVCO0lBQUQsdUJBQUM7Q0FBQSxBQWZELENBQXNDLEtBQUssQ0FBQyxTQUFTLEdBZXBEO0FBZlksNENBQWdCIn0=