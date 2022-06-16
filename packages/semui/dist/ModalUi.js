"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var ActionUi_1 = require("./ActionUi");
var ModalUi = /** @class */ (function (_super) {
    tslib_1.__extends(ModalUi, _super);
    function ModalUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModalUi.prototype.renderActions = function () {
        var _a = this.props, modal = _a.modal, footer = _a.footer;
        var actions = modal.actions;
        if (!actions) {
            return undefined;
        }
        if (footer) {
            return React.createElement(semantic_ui_react_1.Modal.Actions, null, footer(actions));
        }
        return (React.createElement(semantic_ui_react_1.Modal.Actions, null,
            actions.cancel && React.createElement(ActionUi_1.ActionButtonUi, { color: "blue", size: "medium", operation: actions.cancel }),
            actions.confirm && React.createElement(ActionUi_1.ActionButtonUi, { color: "blue", size: "medium", operation: actions.confirm })));
    };
    ModalUi.prototype.render = function () {
        var _a = this.props, modal = _a.modal, children = _a.children, modalProps = tslib_1.__rest(_a, ["modal", "children"]);
        var onOpen = modal.onOpen, onClose = modal.onClose, size = modal.size, header = modal.header, open = modal.open;
        return (React.createElement(semantic_ui_react_1.Modal, tslib_1.__assign({}, modalProps, { onOpen: onOpen, onClose: onClose, open: open, size: size }),
            React.createElement(semantic_ui_react_1.Modal.Header, null, header),
            React.createElement(semantic_ui_react_1.Modal.Content, null, children),
            this.renderActions()));
    };
    ModalUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], ModalUi);
    return ModalUi;
}(React.Component));
exports.ModalUi = ModalUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kYWxVaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Nb2RhbFVpLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5Q0FBc0M7QUFDdEMsNkJBQStCO0FBQy9CLHVEQUFzRDtBQUN0RCx1Q0FBNEM7QUFPNUM7SUFBdUUsbUNBQXVDO0lBQTlHOztJQWdDQSxDQUFDO0lBL0JHLCtCQUFhLEdBQWI7UUFDVSxJQUFBLGVBQThCLEVBQTVCLGdCQUFLLEVBQUUsa0JBQXFCLENBQUM7UUFDN0IsSUFBQSx1QkFBTyxDQUFXO1FBRTFCLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDVixPQUFPLFNBQVMsQ0FBQztTQUNwQjtRQUVELElBQUksTUFBTSxFQUFFO1lBQ1IsT0FBTyxvQkFBQyx5QkFBSyxDQUFDLE9BQU8sUUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQWlCLENBQUM7U0FDM0Q7UUFFRCxPQUFPLENBQ0gsb0JBQUMseUJBQUssQ0FBQyxPQUFPO1lBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxvQkFBQyx5QkFBYyxJQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE1BQU0sR0FBSTtZQUMxRixPQUFPLENBQUMsT0FBTyxJQUFJLG9CQUFDLHlCQUFjLElBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxHQUFJLENBQ2pGLENBQ25CLENBQUM7SUFDTixDQUFDO0lBRUQsd0JBQU0sR0FBTjtRQUNJLElBQU0sZUFBK0MsRUFBN0MsZ0JBQUssRUFBRSxzQkFBUSxFQUFFLHNEQUE0QixDQUFDO1FBQzlDLElBQUEscUJBQU0sRUFBRSx1QkFBTyxFQUFFLGlCQUFJLEVBQUUscUJBQU0sRUFBRSxpQkFBSSxDQUFXO1FBQ3RELE9BQU8sQ0FDSCxvQkFBQyx5QkFBSyx1QkFBSyxVQUFVLElBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7WUFDM0Usb0JBQUMseUJBQUssQ0FBQyxNQUFNLFFBQUUsTUFBTSxDQUFnQjtZQUNyQyxvQkFBQyx5QkFBSyxDQUFDLE9BQU8sUUFBRSxRQUFRLENBQWlCO1lBQ3hDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FDakIsQ0FDWCxDQUFDO0lBQ04sQ0FBQztJQS9CUSxPQUFPO1FBRG5CLHFCQUFRO09BQ0ksT0FBTyxDQWdDbkI7SUFBRCxjQUFDO0NBQUEsQUFoQ0QsQ0FBdUUsS0FBSyxDQUFDLFNBQVMsR0FnQ3JGO0FBaENZLDBCQUFPIn0=