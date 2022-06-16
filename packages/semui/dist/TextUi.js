"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var BindUi_1 = require("./BindUi");
var TextUi = /** @class */ (function (_super) {
    tslib_1.__extends(TextUi, _super);
    function TextUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // tslint:disable-next-line:cyclomatic-complexity
    TextUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, id = _a.id, type = _a.type, width = _a.width, value = _a.value, label = _a.label, size = _a.size, invisible = _a.invisible, hideErrors = _a.hideErrors, props = tslib_1.__rest(_a, ["operation", "id", "type", "width", "value", "label", "size", "invisible", "hideErrors"]);
        if (invisible) {
            return null;
        }
        return (React.createElement(semantic_ui_react_1.Form.Field, { id: id, error: operation.hasErrors, width: width, size: size, required: operation.required },
            React.createElement("label", { htmlFor: id + '_in' }, BindUi_1.labelWithHelp(label != null ? label : operation.label, operation.help)),
            operation.control === 'input' && (React.createElement(semantic_ui_react_1.Input, tslib_1.__assign({ id: id + '_in', type: type || operation.inputType || undefined, placeholder: operation.placeholder, value: operation.value || value || '', onChange: function (e) { return operation.setValue(e.target.value); }, onFocus: operation.onEnterField, onBlur: operation.onExitField }, props))),
            operation.control === 'textarea' && (React.createElement(semantic_ui_react_1.TextArea, tslib_1.__assign({ id: id + '_in', type: type || operation.inputType || undefined, placeholder: operation.placeholder, value: operation.value || value || '', onChange: function (e) { return operation.setValue(e.target.value); }, onFocus: operation.onEnterField, onBlur: operation.onExitField }, props))),
            !hideErrors && (React.createElement(semantic_ui_react_1.Message, { onDismiss: operation.hasErrors ? operation.clearErrors : undefined, hidden: !operation.hasErrors, negative: true },
                React.createElement(semantic_ui_react_1.Message.Header, null, moxb_1.t('FormUi.errors.header', 'Errors', { count: operation.errors.length })),
                React.createElement(semantic_ui_react_1.Message.List, { items: mobx_1.toJS(operation.errors) })))));
    };
    TextUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], TextUi);
    return TextUi;
}(React.Component));
exports.TextUi = TextUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dFVpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1RleHRVaS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXFDO0FBQ3JDLDZCQUE0QjtBQUM1Qix5Q0FBc0M7QUFDdEMsNkJBQStCO0FBQy9CLHVEQUFtRjtBQUNuRixtQ0FBcUQ7QUFVckQ7SUFBNEIsa0NBQW1EO0lBQS9FOztJQTZEQSxDQUFDO0lBNURHLGlEQUFpRDtJQUNqRCx1QkFBTSxHQUFOO1FBQ0ksSUFBTSxvQ0FFTCxFQUZPLHdCQUFTLEVBQUUsVUFBRSxFQUFFLGNBQUksRUFBRSxnQkFBSyxFQUFFLGdCQUFLLEVBQUUsZ0JBQUssRUFBRSxjQUFJLEVBQUUsd0JBQVMsRUFBRSwwQkFBVSxFQUFFLHFIQUU5RSxDQUFDO1FBQ0YsSUFBSSxTQUFTLEVBQUU7WUFDWCxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxDQUNILG9CQUFDLHdCQUFJLENBQUMsS0FBSyxJQUNQLEVBQUUsRUFBRSxFQUFFLEVBQ04sS0FBSyxFQUFFLFNBQVMsQ0FBQyxTQUFTLEVBQzFCLEtBQUssRUFBRSxLQUFZLEVBQ25CLElBQUksRUFBRSxJQUFXLEVBQ2pCLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUTtZQUU1QiwrQkFBTyxPQUFPLEVBQUUsRUFBRSxHQUFHLEtBQUssSUFDckIsc0JBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUNuRTtZQUVQLFNBQVMsQ0FBQyxPQUFPLEtBQUssT0FBTyxJQUFJLENBQzlCLG9CQUFDLHlCQUFLLHFCQUNGLEVBQUUsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUNkLElBQUksRUFBRSxJQUFJLElBQUksU0FBUyxDQUFDLFNBQVMsSUFBSSxTQUFTLEVBQzlDLFdBQVcsRUFBRSxTQUFTLENBQUMsV0FBVyxFQUNsQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUssSUFBSSxLQUFLLElBQUksRUFBRSxFQUNyQyxRQUFRLEVBQUUsVUFBQyxDQUFNLElBQUssT0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQWxDLENBQWtDLEVBQ3hELE9BQU8sRUFBRSxTQUFTLENBQUMsWUFBWSxFQUMvQixNQUFNLEVBQUUsU0FBUyxDQUFDLFdBQVcsSUFDeEIsS0FBYSxFQUNwQixDQUNMO1lBQ0EsU0FBUyxDQUFDLE9BQU8sS0FBSyxVQUFVLElBQUksQ0FDakMsb0JBQUMsNEJBQVEscUJBQ0wsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQ2QsSUFBSSxFQUFFLElBQUksSUFBSSxTQUFTLENBQUMsU0FBUyxJQUFJLFNBQVMsRUFDOUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxXQUFXLEVBQ2xDLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxJQUFJLEtBQUssSUFBSSxFQUFFLEVBQ3JDLFFBQVEsRUFBRSxVQUFDLENBQU0sSUFBSyxPQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBbEMsQ0FBa0MsRUFDeEQsT0FBTyxFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQy9CLE1BQU0sRUFBRSxTQUFTLENBQUMsV0FBVyxJQUN4QixLQUFhLEVBQ3BCLENBQ0w7WUFFQSxDQUFDLFVBQVUsSUFBSSxDQUNaLG9CQUFDLDJCQUFPLElBQ0osU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFDbEUsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFDNUIsUUFBUTtnQkFFUixvQkFBQywyQkFBTyxDQUFDLE1BQU0sUUFDVixRQUFDLENBQUMsc0JBQXNCLEVBQUUsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FDNUQ7Z0JBQ2pCLG9CQUFDLDJCQUFPLENBQUMsSUFBSSxJQUFDLEtBQUssRUFBRSxXQUFJLENBQUMsU0FBUyxDQUFDLE1BQU8sQ0FBQyxHQUFJLENBQzFDLENBQ2IsQ0FDUSxDQUNoQixDQUFDO0lBQ04sQ0FBQztJQTVEUSxNQUFNO1FBRGxCLHFCQUFRO09BQ0ksTUFBTSxDQTZEbEI7SUFBRCxhQUFDO0NBQUEsQUE3REQsQ0FBNEIsS0FBSyxDQUFDLFNBQVMsR0E2RDFDO0FBN0RZLHdCQUFNIn0=