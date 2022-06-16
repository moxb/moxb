"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var ConfirmUi = /** @class */ (function (_super) {
    tslib_1.__extends(ConfirmUi, _super);
    function ConfirmUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConfirmUi.prototype.render = function () {
        var _a = this.props, confirm = _a.confirm, confirmProps = tslib_1.__rest(_a, ["confirm"]);
        var confirmButton = confirm.confirmButton, cancelButton = confirm.cancelButton, onConfirm = confirm.onConfirm, onCancel = confirm.onCancel;
        return (React.createElement(semantic_ui_react_1.Confirm, tslib_1.__assign({}, confirmProps, { onConfirm: onConfirm, onCancel: onCancel, open: confirm.open, cancelButton: cancelButton.label, confirmButton: confirmButton.label, content: confirm.content, header: confirm.header })));
    };
    ConfirmUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], ConfirmUi);
    return ConfirmUi;
}(React.Component));
exports.ConfirmUi = ConfirmUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlybVVpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbmZpcm1VaS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseUNBQXNDO0FBQ3RDLDZCQUErQjtBQUMvQix1REFBMEQ7QUFPMUQ7SUFBK0IscUNBQW1DO0lBQWxFOztJQWlCQSxDQUFDO0lBaEJHLDBCQUFNLEdBQU47UUFDSSxJQUFNLGVBQXlDLEVBQXZDLG9CQUFPLEVBQUUsOENBQThCLENBQUM7UUFDeEMsSUFBQSxxQ0FBYSxFQUFFLG1DQUFZLEVBQUUsNkJBQVMsRUFBRSwyQkFBUSxDQUFhO1FBQ3JFLE9BQU8sQ0FDSCxvQkFBQywyQkFBTyx1QkFDQSxZQUFZLElBQ2hCLFNBQVMsRUFBRSxTQUFTLEVBQ3BCLFFBQVEsRUFBRSxRQUFRLEVBQ2xCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxFQUNsQixZQUFZLEVBQUUsWUFBWSxDQUFDLEtBQUssRUFDaEMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxLQUFLLEVBQ2xDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxFQUN4QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sSUFDeEIsQ0FDTCxDQUFDO0lBQ04sQ0FBQztJQWhCUSxTQUFTO1FBRHJCLHFCQUFRO09BQ0ksU0FBUyxDQWlCckI7SUFBRCxnQkFBQztDQUFBLEFBakJELENBQStCLEtBQUssQ0FBQyxTQUFTLEdBaUI3QztBQWpCWSw4QkFBUyJ9