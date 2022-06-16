"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var BindUi_1 = require("./BindUi");
var BoolUi = /** @class */ (function (_super) {
    tslib_1.__extends(BoolUi, _super);
    function BoolUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoolUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, id = _a.id, invisible = _a.invisible, children = _a.children, hideErrors = _a.hideErrors, label = _a.label, props = tslib_1.__rest(_a, ["operation", "id", "invisible", "children", "hideErrors", "label"]);
        if (invisible) {
            return null;
        }
        // a null value renders the checkbox in intermediate state!
        var indeterminate = operation.value == null;
        return (React.createElement(semantic_ui_react_1.Form.Field, { id: id, error: operation.hasErrors, required: operation.required },
            React.createElement("label", { htmlFor: id + '_in' }, BindUi_1.labelWithHelp(label != null ? label : operation.label, operation.help)),
            React.createElement(semantic_ui_react_1.Checkbox, tslib_1.__assign({ id: id + '_in', "data-testid": id, type: operation.inputType || this.props.type || 'checkbox', checked: operation.value, onChange: function () { return operation.toggle(); }, indeterminate: indeterminate }, props)),
            children,
            !hideErrors && (React.createElement(semantic_ui_react_1.Message, { onDismiss: operation.hasErrors ? operation.clearErrors : undefined, hidden: !operation.hasErrors, negative: true },
                React.createElement(semantic_ui_react_1.Message.Header, null, moxb_1.t('BoolUi.errors.header', 'Errors', { count: operation.errors.length })),
                React.createElement(semantic_ui_react_1.Message.List, { items: mobx_1.toJS(operation.errors) })))));
    };
    BoolUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], BoolUi);
    return BoolUi;
}(React.Component));
exports.BoolUi = BoolUi;
var BoolDropdownItemUi = /** @class */ (function (_super) {
    tslib_1.__extends(BoolDropdownItemUi, _super);
    function BoolDropdownItemUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoolDropdownItemUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, id = _a.id, label = _a.label, invisible = _a.invisible, children = _a.children, props = tslib_1.__rest(_a, ["operation", "id", "label", "invisible", "children"]);
        if (invisible || operation.invisible) {
            return null;
        }
        // color, size and width cause problems when in ...props
        return (React.createElement(semantic_ui_react_1.Dropdown.Item, tslib_1.__assign({ id: id, onClick: operation.toggle }, props), children || operation.labelToggle || label));
    };
    BoolDropdownItemUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], BoolDropdownItemUi);
    return BoolDropdownItemUi;
}(React.Component));
exports.BoolDropdownItemUi = BoolDropdownItemUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbFVpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0Jvb2xVaS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXFDO0FBQ3JDLDZCQUE0QjtBQUM1Qix5Q0FBc0M7QUFDdEMsNkJBQStCO0FBQy9CLHVEQUF3RztBQUN4RyxtQ0FBa0U7QUFHbEU7SUFBNEIsa0NBQXdEO0lBQXBGOztJQXdDQSxDQUFDO0lBdkNHLHVCQUFNLEdBQU47UUFDSSxJQUFNLG9DQUE0RixFQUExRix3QkFBUyxFQUFFLFVBQUUsRUFBRSx3QkFBUyxFQUFFLHNCQUFRLEVBQUUsMEJBQVUsRUFBRSxnQkFBSyxFQUFFLCtGQUFtQyxDQUFDO1FBQ25HLElBQUksU0FBUyxFQUFFO1lBQ1gsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELDJEQUEyRDtRQUMzRCxJQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztRQUM5QyxPQUFPLENBQ0gsb0JBQUMsd0JBQUksQ0FBQyxLQUFLLElBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7WUFDeEUsK0JBQU8sT0FBTyxFQUFFLEVBQUUsR0FBRyxLQUFLLElBQ3JCLHNCQUFhLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FDbkU7WUFFUixvQkFBQyw0QkFBUSxxQkFDTCxFQUFFLEVBQUUsRUFBRSxHQUFHLEtBQUssaUJBQ0QsRUFBRSxFQUNmLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFDMUQsT0FBTyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQ3hCLFFBQVEsRUFBRSxjQUFNLE9BQUEsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFsQixDQUFrQixFQUNsQyxhQUFhLEVBQUUsYUFBYSxJQUN2QixLQUFhLEVBQ3BCO1lBQ0QsUUFBUTtZQUVSLENBQUMsVUFBVSxJQUFJLENBQ1osb0JBQUMsMkJBQU8sSUFDSixTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUNsRSxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUM1QixRQUFRO2dCQUVSLG9CQUFDLDJCQUFPLENBQUMsTUFBTSxRQUNWLFFBQUMsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLE1BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUM1RDtnQkFDakIsb0JBQUMsMkJBQU8sQ0FBQyxJQUFJLElBQUMsS0FBSyxFQUFFLFdBQUksQ0FBQyxTQUFTLENBQUMsTUFBTyxDQUFDLEdBQUksQ0FDMUMsQ0FDYixDQUNRLENBQ2hCLENBQUM7SUFDTixDQUFDO0lBdkNRLE1BQU07UUFEbEIscUJBQVE7T0FDSSxNQUFNLENBd0NsQjtJQUFELGFBQUM7Q0FBQSxBQXhDRCxDQUE0QixLQUFLLENBQUMsU0FBUyxHQXdDMUM7QUF4Q1ksd0JBQU07QUEyQ25CO0lBQXdDLDhDQUFrRDtJQUExRjs7SUFhQSxDQUFDO0lBWkcsbUNBQU0sR0FBTjtRQUNJLElBQU0sb0NBQWdGLEVBQTlFLHdCQUFTLEVBQUUsVUFBRSxFQUFFLGdCQUFLLEVBQUUsd0JBQVMsRUFBRSxzQkFBUSxFQUFFLGlGQUFtQyxDQUFDO1FBQ3ZGLElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDbEMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELHdEQUF3RDtRQUN4RCxPQUFPLENBQ0gsb0JBQUMsNEJBQVEsQ0FBQyxJQUFJLHFCQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxNQUFNLElBQU8sS0FBYSxHQUMvRCxRQUFRLElBQUksU0FBUyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQy9CLENBQ25CLENBQUM7SUFDTixDQUFDO0lBWlEsa0JBQWtCO1FBRDlCLHFCQUFRO09BQ0ksa0JBQWtCLENBYTlCO0lBQUQseUJBQUM7Q0FBQSxBQWJELENBQXdDLEtBQUssQ0FBQyxTQUFTLEdBYXREO0FBYlksZ0RBQWtCIn0=