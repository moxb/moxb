"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var BindUi_1 = require("./BindUi");
var ManyOfUi = /** @class */ (function (_super) {
    tslib_1.__extends(ManyOfUi, _super);
    function ManyOfUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ManyOfUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, id = _a.id, invisible = _a.invisible, type = _a.type, width = _a.width, hideErrors = _a.hideErrors, label = _a.label, error = _a.error, props = tslib_1.__rest(_a, ["operation", "id", "invisible", "type", "width", "hideErrors", "label", "error"]);
        if (invisible || operation.invisible) {
            return null;
        }
        var options = operation.choices.map(function (c) { return ({ key: c.value, text: c.label, value: c.value }); });
        // make sure the value is not a mobx object...
        var value = mobx_1.toJS(operation.value);
        return (React.createElement(semantic_ui_react_1.Form.Field, { id: id, error: operation.hasErrors, required: operation.required },
            React.createElement("label", { htmlFor: id + '_in' }, BindUi_1.labelWithHelp(label != null ? label : operation.label, operation.help)),
            React.createElement(semantic_ui_react_1.Dropdown, tslib_1.__assign({ id: id, onChange: function (_e, data) { return operation.setValue(data.value); }, options: options, value: value, error: !!error }, props, { width: width, type: type })),
            !hideErrors && (React.createElement(semantic_ui_react_1.Message, { onDismiss: operation.hasErrors ? operation.clearErrors : undefined, hidden: !operation.hasErrors, negative: true },
                React.createElement(semantic_ui_react_1.Message.Header, null, moxb_1.t('ManyOfUi.errors.header', 'Errors', { count: operation.errors.length })),
                React.createElement(semantic_ui_react_1.Message.List, { items: mobx_1.toJS(operation.errors) })))));
    };
    ManyOfUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], ManyOfUi);
    return ManyOfUi;
}(React.Component));
exports.ManyOfUi = ManyOfUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFueU9mVWkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTWFueU9mVWkudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUF1QztBQUN2Qyw2QkFBNEI7QUFDNUIseUNBQXNDO0FBQ3RDLDZCQUErQjtBQUMvQix1REFBNEU7QUFDNUUsbUNBQWtFO0FBR2xFO0lBQThCLG9DQUFxRDtJQUFuRjs7SUF5Q0EsQ0FBQztJQXhDRyx5QkFBTSxHQUFOO1FBQ0ksSUFBTSxvQ0FBc0csRUFBcEcsd0JBQVMsRUFBRSxVQUFFLEVBQUUsd0JBQVMsRUFBRSxjQUFJLEVBQUUsZ0JBQUssRUFBRSwwQkFBVSxFQUFFLGdCQUFLLEVBQUUsZ0JBQUssRUFBRSw2R0FBbUMsQ0FBQztRQUM3RyxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQWpELENBQWlELENBQUMsQ0FBQztRQUNoRyw4Q0FBOEM7UUFDOUMsSUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxPQUFPLENBQ0gsb0JBQUMsd0JBQUksQ0FBQyxLQUFLLElBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7WUFDeEUsK0JBQU8sT0FBTyxFQUFFLEVBQUUsR0FBRyxLQUFLLElBQ3JCLHNCQUFhLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FDbkU7WUFFUixvQkFBQyw0QkFBUSxxQkFDTCxFQUFFLEVBQUUsRUFBRSxFQUNOLFFBQVEsRUFBRSxVQUFDLEVBQUUsRUFBRSxJQUFJLElBQUssT0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFpQixDQUFDLEVBQTFDLENBQTBDLEVBQ2xFLE9BQU8sRUFBRSxPQUFPLEVBQ2hCLEtBQUssRUFBRSxLQUFLLEVBQ1osS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQ1YsS0FBSyxJQUNULEtBQUssRUFBRSxLQUFZLEVBQ25CLElBQUksRUFBRSxJQUFXLElBQ25CO1lBRUQsQ0FBQyxVQUFVLElBQUksQ0FDWixvQkFBQywyQkFBTyxJQUNKLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQ2xFLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQzVCLFFBQVE7Z0JBRVIsb0JBQUMsMkJBQU8sQ0FBQyxNQUFNLFFBQ1YsUUFBQyxDQUFDLHdCQUF3QixFQUFFLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQzlEO2dCQUNqQixvQkFBQywyQkFBTyxDQUFDLElBQUksSUFBQyxLQUFLLEVBQUUsV0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFPLENBQUMsR0FBSSxDQUMxQyxDQUNiLENBQ1EsQ0FDaEIsQ0FBQztJQUNOLENBQUM7SUF4Q1EsUUFBUTtRQURwQixxQkFBUTtPQUNJLFFBQVEsQ0F5Q3BCO0lBQUQsZUFBQztDQUFBLEFBekNELENBQThCLEtBQUssQ0FBQyxTQUFTLEdBeUM1QztBQXpDWSw0QkFBUSJ9