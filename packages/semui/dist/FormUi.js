"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var BindUi_1 = require("./BindUi");
var FormUi = /** @class */ (function (_super) {
    tslib_1.__extends(FormUi, _super);
    function FormUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, children = _a.children, invisible = _a.invisible, hideErrors = _a.hideErrors, props = tslib_1.__rest(_a, ["operation", "children", "invisible", "hideErrors"]);
        if (invisible) {
            return null;
        }
        return (React.createElement(semantic_ui_react_1.Form, tslib_1.__assign({ onSubmit: operation.onSubmitForm }, props, { error: operation.hasErrors }),
            children,
            !hideErrors && (React.createElement(semantic_ui_react_1.Message, { attached: "bottom", onDismiss: operation.hasErrors ? operation.clearErrors : undefined, hidden: !operation.hasErrors, negative: true },
                React.createElement(semantic_ui_react_1.Message.Header, null, moxb_1.t('FormUi.errors.header', 'Errors', { count: operation.allErrors.length })),
                React.createElement(semantic_ui_react_1.Message.List, { items: operation.allErrors })))));
    };
    FormUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], FormUi);
    return FormUi;
}(React.Component));
exports.FormUi = FormUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybVVpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0Zvcm1VaS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQWdEO0FBQ2hELHlDQUFzQztBQUN0Qyw2QkFBK0I7QUFDL0IsdURBQTZEO0FBQzdELG1DQUFzQztBQVF0QztJQUE0QixrQ0FBNEM7SUFBeEU7O0lBeUJBLENBQUM7SUF4QkcsdUJBQU0sR0FBTjtRQUNJLElBQU0sb0NBQWlGLEVBQS9FLHdCQUFTLEVBQUUsc0JBQVEsRUFBRSx3QkFBUyxFQUFFLDBCQUFVLEVBQUUsZ0ZBQW1DLENBQUM7UUFDeEYsSUFBSSxTQUFTLEVBQUU7WUFDWCxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxDQUNILG9CQUFDLHdCQUFJLHFCQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsWUFBWSxJQUFNLEtBQUssSUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLFNBQVM7WUFDeEUsUUFBUTtZQUNSLENBQUMsVUFBVSxJQUFJLENBQ1osb0JBQUMsMkJBQU8sSUFDSixRQUFRLEVBQUMsUUFBUSxFQUNqQixTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUNsRSxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUM1QixRQUFRO2dCQUVSLG9CQUFDLDJCQUFPLENBQUMsTUFBTSxRQUNWLFFBQUMsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUM5RDtnQkFDakIsb0JBQUMsMkJBQU8sQ0FBQyxJQUFJLElBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxTQUFTLEdBQUksQ0FDdEMsQ0FDYixDQUNFLENBQ1YsQ0FBQztJQUNOLENBQUM7SUF4QlEsTUFBTTtRQURsQixxQkFBUTtPQUNJLE1BQU0sQ0F5QmxCO0lBQUQsYUFBQztDQUFBLEFBekJELENBQTRCLEtBQUssQ0FBQyxTQUFTLEdBeUIxQztBQXpCWSx3QkFBTSJ9