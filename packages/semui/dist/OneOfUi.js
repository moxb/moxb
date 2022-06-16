"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var BindUi_1 = require("./BindUi");
var OneOfUi = /** @class */ (function (_super) {
    tslib_1.__extends(OneOfUi, _super);
    function OneOfUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OneOfUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, id = _a.id, label = _a.label, invisible = _a.invisible, hideErrors = _a.hideErrors, type = _a.type, width = _a.width, props = tslib_1.__rest(_a, ["operation", "id", "label", "invisible", "hideErrors", "type", "width"]);
        if (invisible) {
            return null;
        }
        return (React.createElement(semantic_ui_react_1.Form.Field, { id: id, error: operation.hasErrors, required: operation.required },
            React.createElement("label", { htmlFor: id + '_in' }, BindUi_1.labelWithHelp(label != null ? label : operation.label, operation.help)),
            operation.choices.map(function (c) { return (React.createElement(semantic_ui_react_1.Checkbox, tslib_1.__assign({ radio: true, id: moxb_1.idToDomId(id + '-' + c.value), onChange: function () { return operation.setValue(c.value); }, key: c.value, name: "checkboxRadioGroup", checked: c.value === operation.value, label: c.label != null ? c.label : c.value }, props, { width: width, type: type }))); }),
            !hideErrors && (React.createElement(semantic_ui_react_1.Message, { onDismiss: operation.hasErrors ? operation.clearErrors : undefined, hidden: !operation.hasErrors, negative: true },
                React.createElement(semantic_ui_react_1.Message.Header, null, moxb_1.t('OneOfSelectUi.errors.header', 'Errors', { count: operation.errors.length })),
                React.createElement(semantic_ui_react_1.Message.List, { items: mobx_1.toJS(operation.errors) })))));
    };
    OneOfUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], OneOfUi);
    return OneOfUi;
}(React.Component));
exports.OneOfUi = OneOfUi;
var OneOfSelectUi = /** @class */ (function (_super) {
    tslib_1.__extends(OneOfSelectUi, _super);
    function OneOfSelectUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OneOfSelectUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, id = _a.id, invisible = _a.invisible, hideErrors = _a.hideErrors, type = _a.type, width = _a.width, label = _a.label, required = _a.required, props = tslib_1.__rest(_a, ["operation", "id", "invisible", "hideErrors", "type", "width", "label", "required"]);
        if (invisible) {
            return null;
        }
        var options = operation.choices.map(function (c) { return ({ text: c.label, value: c.value }); });
        return (React.createElement(semantic_ui_react_1.Form.Field, { id: id, error: operation.hasErrors, required: required },
            React.createElement("label", { htmlFor: id + '_in' }, BindUi_1.labelWithHelp(label != null ? label : operation.label, operation.help)),
            React.createElement(semantic_ui_react_1.Select, tslib_1.__assign({ id: id + '_in', onChange: function (_e, _a) {
                    var value = _a.value;
                    return operation.setValue(value);
                }, options: options, defaultValue: operation.value, width: width, type: type }, props)),
            !hideErrors && (React.createElement(semantic_ui_react_1.Message, { onDismiss: operation.hasErrors ? operation.clearErrors : undefined, hidden: !operation.hasErrors, negative: true },
                React.createElement(semantic_ui_react_1.Message.Header, null, moxb_1.t('OneOfSelectUi.errors.header', 'Errors', { count: operation.errors.length })),
                React.createElement(semantic_ui_react_1.Message.List, { items: mobx_1.toJS(operation.errors) })))));
    };
    OneOfSelectUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], OneOfSelectUi);
    return OneOfSelectUi;
}(React.Component));
exports.OneOfSelectUi = OneOfSelectUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT25lT2ZVaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9PbmVPZlVpLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBaUQ7QUFDakQsNkJBQTRCO0FBQzVCLHlDQUFzQztBQUN0Qyw2QkFBK0I7QUFDL0IsdURBQW9HO0FBQ3BHLG1DQUFrRTtBQUdsRTtJQUE2QixtQ0FBb0Q7SUFBakY7O0lBMENBLENBQUM7SUF6Q0csd0JBQU0sR0FBTjtRQUNJLElBQU0sb0NBQStGLEVBQTdGLHdCQUFTLEVBQUUsVUFBRSxFQUFFLGdCQUFLLEVBQUUsd0JBQVMsRUFBRSwwQkFBVSxFQUFFLGNBQUksRUFBRSxnQkFBSyxFQUFFLG9HQUFtQyxDQUFDO1FBQ3RHLElBQUksU0FBUyxFQUFFO1lBQ1gsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sQ0FDSCxvQkFBQyx3QkFBSSxDQUFDLEtBQUssSUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUTtZQUN4RSwrQkFBTyxPQUFPLEVBQUUsRUFBRSxHQUFHLEtBQUssSUFDckIsc0JBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUNuRTtZQUVQLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FDMUIsb0JBQUMsNEJBQVEscUJBQ0wsS0FBSyxRQUNMLEVBQUUsRUFBRSxnQkFBUyxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUNqQyxRQUFRLEVBQUUsY0FBTSxPQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUEzQixDQUEyQixFQUMzQyxHQUFH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