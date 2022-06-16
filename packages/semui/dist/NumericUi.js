"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var BindUi_1 = require("./BindUi");
var NumericUi = /** @class */ (function (_super) {
    tslib_1.__extends(NumericUi, _super);
    function NumericUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumericUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, id = _a.id, label = _a.label, invisible = _a.invisible, hideErrors = _a.hideErrors, width = _a.width, size = _a.size, props = tslib_1.__rest(_a, ["operation", "id", "label", "invisible", "hideErrors", "width", "size"]);
        if (invisible) {
            return null;
        }
        return (React.createElement(semantic_ui_react_1.Form.Field, { id: id, error: operation.hasErrors, width: width, size: size, required: operation.required },
            React.createElement("label", { htmlFor: id + '_in' }, BindUi_1.labelWithHelp(label != null ? label : operation.label, operation.help)),
            React.createElement(semantic_ui_react_1.Input, tslib_1.__assign({ id: id + '_in', type: operation.inputType || this.props.type || 'number', placeholder: "Interval", value: operation.value, min: operation.min, max: operation.max, step: operation.step, onChange: function (e) { return operation.setValue(parseInt(e.target.value)); }, onFocus: operation.onEnterField, onBlur: operation.onExitField }, props)),
            !hideErrors && (React.createElement(semantic_ui_react_1.Message, { onDismiss: operation.hasErrors ? operation.clearErrors : undefined, hidden: !operation.hasErrors, negative: true },
                React.createElement(semantic_ui_react_1.Message.Header, null, moxb_1.t('NumericUi.errors.header', 'Errors', { count: operation.errors.length })),
                React.createElement(semantic_ui_react_1.Message.List, { items: mobx_1.toJS(operation.errors) })))));
    };
    NumericUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], NumericUi);
    return NumericUi;
}(React.Component));
exports.NumericUi = NumericUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnVtZXJpY1VpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL051bWVyaWNVaS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXdDO0FBQ3hDLDZCQUE0QjtBQUM1Qix5Q0FBc0M7QUFDdEMsNkJBQStCO0FBQy9CLHVEQUF5RTtBQUN6RSxtQ0FBcUQ7QUFTckQ7SUFBK0IscUNBQW9EO0lBQW5GOztJQStDQSxDQUFDO0lBOUNHLDBCQUFNLEdBQU47UUFDSSxJQUFNLG9DQUErRixFQUE3Rix3QkFBUyxFQUFFLFVBQUUsRUFBRSxnQkFBSyxFQUFFLHdCQUFTLEVBQUUsMEJBQVUsRUFBRSxnQkFBSyxFQUFFLGNBQUksRUFBRSxvR0FBbUMsQ0FBQztRQUN0RyxJQUFJLFNBQVMsRUFBRTtZQUNYLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLENBQ0gsb0JBQUMsd0JBQUksQ0FBQyxLQUFLLElBQ1AsRUFBRSxFQUFFLEVBQUUsRUFDTixLQUFLLEVBQUUsU0FBUyxDQUFDLFNBQVMsRUFDMUIsS0FBSyxFQUFFLEtBQVksRUFDbkIsSUFBSSxFQUFFLElBQVcsRUFDakIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxRQUFRO1lBRTVCLCtCQUFPLE9BQU8sRUFBRSxFQUFFLEdBQUcsS0FBSyxJQUNyQixzQkFBYSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQ25FO1lBRVIsb0JBQUMseUJBQUsscUJBQ0YsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQ2QsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksUUFBUSxFQUN4RCxXQUFXLEVBQUMsVUFBVSxFQUN0QixLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFDdEIsR0FBRyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQ2xCLEdBQUcsRUFBRSxTQUFTLENBQUMsR0FBRyxFQUNsQixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksRUFDcEIsUUFBUSxFQUFFLFVBQUMsQ0FBQyxJQUFLLE9BQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUUsQ0FBQyxDQUFDLE1BQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFyRCxDQUFxRCxFQUN0RSxPQUFPLEVBQUUsU0FBUyxDQUFDLFlBQVksRUFDL0IsTUFBTSxFQUFFLFNBQVMsQ0FBQyxXQUFXLElBQ3hCLEtBQWEsRUFDcEI7WUFFRCxDQUFDLFVBQVUsSUFBSSxDQUNaLG9CQUFDLDJCQUFPLElBQ0osU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFDbEUsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFDNUIsUUFBUTtnQkFFUixvQkFBQywyQkFBTyxDQUFDLE1BQU0sUUFDVixRQUFDLENBQUMseUJBQXlCLEVBQUUsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FDL0Q7Z0JBQ2pCLG9CQUFDLDJCQUFPLENBQUMsSUFBSSxJQUFDLEtBQUssRUFBRSxXQUFJLENBQUMsU0FBUyxDQUFDLE1BQU8sQ0FBQyxHQUFJLENBQzFDLENBQ2IsQ0FDUSxDQUNoQixDQUFDO0lBQ04sQ0FBQztJQTlDUSxTQUFTO1FBRHJCLHFCQUFRO09BQ0ksU0FBUyxDQStDckI7SUFBRCxnQkFBQztDQUFBLEFBL0NELENBQStCLEtBQUssQ0FBQyxTQUFTLEdBK0M3QztBQS9DWSw4QkFBUyJ9