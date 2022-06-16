"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var BindUi_1 = require("./BindUi");
var ActionFormButtonUi = /** @class */ (function (_super) {
    tslib_1.__extends(ActionFormButtonUi, _super);
    function ActionFormButtonUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionFormButtonUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, id = _a.id, label = _a.label, invisible = _a.invisible, children = _a.children, color = _a.color, size = _a.size, width = _a.width, props = tslib_1.__rest(_a, ["operation", "id", "label", "invisible", "children", "color", "size", "width"]);
        if (invisible || operation.invisible) {
            return null;
        }
        // color, size and width cause problems when in ...props
        return (React.createElement(semantic_ui_react_1.Form.Button, tslib_1.__assign({ id: id, onClick: operation.fire }, props, { color: color, size: size, width: width }), children || label));
    };
    ActionFormButtonUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], ActionFormButtonUi);
    return ActionFormButtonUi;
}(React.Component));
exports.ActionFormButtonUi = ActionFormButtonUi;
var ActionButtonUi = /** @class */ (function (_super) {
    tslib_1.__extends(ActionButtonUi, _super);
    function ActionButtonUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionButtonUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, id = _a.id, label = _a.label, invisible = _a.invisible, children = _a.children, color = _a.color, size = _a.size, width = _a.width, props = tslib_1.__rest(_a, ["operation", "id", "label", "invisible", "children", "color", "size", "width"]);
        if (invisible || operation.invisible) {
            return null;
        }
        // color, size and width cause problems when in ...props
        return (React.createElement(semantic_ui_react_1.Button, tslib_1.__assign({ id: id, onClick: operation.fire }, props, { color: color, size: size, width: width, loading: operation.pending }), children || label));
    };
    ActionButtonUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], ActionButtonUi);
    return ActionButtonUi;
}(React.Component));
exports.ActionButtonUi = ActionButtonUi;
var ActionDropdownItemUi = /** @class */ (function (_super) {
    tslib_1.__extends(ActionDropdownItemUi, _super);
    function ActionDropdownItemUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionDropdownItemUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, id = _a.id, label = _a.label, invisible = _a.invisible, children = _a.children, props = tslib_1.__rest(_a, ["operation", "id", "label", "invisible", "children"]);
        if (invisible || operation.invisible) {
            return null;
        }
        // color, size and width cause problems when in ...props
        return (React.createElement(semantic_ui_react_1.Dropdown.Item, tslib_1.__assign({ id: id, onClick: operation.fire }, props), children || label));
    };
    ActionDropdownItemUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], ActionDropdownItemUi);
    return ActionDropdownItemUi;
}(React.Component));
exports.ActionDropdownItemUi = ActionDropdownItemUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9uVWkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQWN0aW9uVWkudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHlDQUFzQztBQUN0Qyw2QkFBK0I7QUFDL0IsdURBQTJGO0FBQzNGLG1DQUFtRDtBQUtuRDtJQUF3Qyw4Q0FBOEI7SUFBdEU7O0lBb0JBLENBQUM7SUFuQkcsbUNBQU0sR0FBTjtRQUNJLElBQU0sb0NBQW9HLEVBQWxHLHdCQUFTLEVBQUUsVUFBRSxFQUFFLGdCQUFLLEVBQUUsd0JBQVMsRUFBRSxzQkFBUSxFQUFFLGdCQUFLLEVBQUUsY0FBSSxFQUFFLGdCQUFLLEVBQUUsMkdBQW1DLENBQUM7UUFDM0csSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLFNBQVMsRUFBRTtZQUNsQyxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0Qsd0RBQXdEO1FBQ3hELE9BQU8sQ0FDSCxvQkFBQyx3QkFBSSxDQUFDLE1BQU0scUJBQ1IsRUFBRSxFQUFFLEVBQUUsRUFDTixPQUFPLEVBQUUsU0FBUyxDQUFDLElBQUksSUFDbkIsS0FBSyxJQUNULEtBQUssRUFBRSxLQUFZLEVBQ25CLElBQUksRUFBRSxJQUFXLEVBQ2pCLEtBQUssRUFBRSxLQUFZLEtBRWxCLFFBQVEsSUFBSSxLQUFLLENBQ1IsQ0FDakIsQ0FBQztJQUNOLENBQUM7SUFuQlEsa0JBQWtCO1FBRDlCLHFCQUFRO09BQ0ksa0JBQWtCLENBb0I5QjtJQUFELHlCQUFDO0NBQUEsQUFwQkQsQ0FBd0MsS0FBSyxDQUFDLFNBQVMsR0FvQnREO0FBcEJZLGdEQUFrQjtBQXVCL0I7SUFBb0MsMENBQThCO0lBQWxFOztJQXFCQSxDQUFDO0lBcEJHLCtCQUFNLEdBQU47UUFDSSxJQUFNLG9DQUFvRyxFQUFsRyx3QkFBUyxFQUFFLFVBQUUsRUFBRSxnQkFBSyxFQUFFLHdCQUFTLEVBQUUsc0JBQVEsRUFBRSxnQkFBSyxFQUFFLGNBQUksRUFBRSxnQkFBSyxFQUFFLDJHQUFtQyxDQUFDO1FBQzNHLElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDbEMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELHdEQUF3RDtRQUN4RCxPQUFPLENBQ0gsb0JBQUMsMEJBQU0scUJBQ0gsRUFBRSxFQUFFLEVBQUUsRUFDTixPQUFPLEVBQUUsU0FBUyxDQUFDLElBQUksSUFDbkIsS0FBSyxJQUNULEtBQUssRUFBRSxLQUFZLEVBQ25CLElBQUksRUFBRSxJQUFXLEVBQ2pCLEtBQUssRUFBRSxLQUFZLEVBQ25CLE9BQU8sRUFBRSxTQUFTLENBQUMsT0FBTyxLQUV6QixRQUFRLElBQUksS0FBSyxDQUNiLENBQ1osQ0FBQztJQUNOLENBQUM7SUFwQlEsY0FBYztRQUQxQixxQkFBUTtPQUNJLGNBQWMsQ0FxQjFCO0lBQUQscUJBQUM7Q0FBQSxBQXJCRCxDQUFvQyxLQUFLLENBQUMsU0FBUyxHQXFCbEQ7QUFyQlksd0NBQWM7QUF1QjNCO0lBQTBDLGdEQUFvRDtJQUE5Rjs7SUFhQSxDQUFDO0lBWkcscUNBQU0sR0FBTjtRQUNJLElBQU0sb0NBQWdGLEVBQTlFLHdCQUFTLEVBQUUsVUFBRSxFQUFFLGdCQUFLLEVBQUUsd0JBQVMsRUFBRSxzQkFBUSxFQUFFLGlGQUFtQyxDQUFDO1FBQ3ZGLElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDbEMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELHdEQUF3RDtRQUN4RCxPQUFPLENBQ0gsb0JBQUMsNEJBQVEsQ0FBQyxJQUFJLHFCQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLElBQU8sS0FBYSxHQUM3RCxRQUFRLElBQUksS0FBSyxDQUNOLENBQ25CLENBQUM7SUFDTixDQUFDO0lBWlEsb0JBQW9CO1FBRGhDLHFCQUFRO09BQ0ksb0JBQW9CLENBYWhDO0lBQUQsMkJBQUM7Q0FBQSxBQWJELENBQTBDLEtBQUssQ0FBQyxTQUFTLEdBYXhEO0FBYlksb0RBQW9CIn0=