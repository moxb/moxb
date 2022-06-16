"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var ActionUi_1 = require("./ActionUi");
var TextUi_1 = require("./TextUi");
var TableSearchUi = /** @class */ (function (_super) {
    tslib_1.__extends(TableSearchUi, _super);
    function TableSearchUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableSearchUi.prototype.render = function () {
        var _a = this.props, search = _a.search, noAlignment = _a.noAlignment;
        return (React.createElement(semantic_ui_react_1.Form, { style: this.props.style, className: noAlignment ? undefined : 'container' },
            React.createElement(semantic_ui_react_1.Form.Group, { inline: true },
                React.createElement(TextUi_1.TextUi, { operation: search.searchField, style: { minWidth: '250px' } }),
                React.createElement(ActionUi_1.ActionFormButtonUi, { type: "submit", operation: search.searchAction }),
                React.createElement(ActionUi_1.ActionButtonUi, { operation: search.clearSearch, className: "clearBtn" },
                    React.createElement(semantic_ui_react_1.Icon, { name: "x", style: { marginLeft: '5px' } })))));
    };
    TableSearchUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], TableSearchUi);
    return TableSearchUi;
}(React.Component));
exports.TableSearchUi = TableSearchUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVTZWFyY2hVaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UYWJsZVNlYXJjaFVpLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5Q0FBc0M7QUFDdEMsNkJBQStCO0FBQy9CLHVEQUErQztBQUMvQyx1Q0FBZ0U7QUFDaEUsbUNBQWtDO0FBU2xDO0lBQW1DLHlDQUF1QztJQUExRTs7SUFlQSxDQUFDO0lBZEcsOEJBQU0sR0FBTjtRQUNVLElBQUEsZUFBb0MsRUFBbEMsa0JBQU0sRUFBRSw0QkFBMEIsQ0FBQztRQUMzQyxPQUFPLENBQ0gsb0JBQUMsd0JBQUksSUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXO1lBQzNFLG9CQUFDLHdCQUFJLENBQUMsS0FBSyxJQUFDLE1BQU07Z0JBQ2Qsb0JBQUMsZUFBTSxJQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBSTtnQkFDdkUsb0JBQUMsNkJBQWtCLElBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFlBQVksR0FBSTtnQkFDcEUsb0JBQUMseUJBQWMsSUFBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUMsVUFBVTtvQkFDL0Qsb0JBQUMsd0JBQUksSUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBSSxDQUNsQyxDQUNSLENBQ1YsQ0FDVixDQUFDO0lBQ04sQ0FBQztJQWRRLGFBQWE7UUFEekIscUJBQVE7T0FDSSxhQUFhLENBZXpCO0lBQUQsb0JBQUM7Q0FBQSxBQWZELENBQW1DLEtBQUssQ0FBQyxTQUFTLEdBZWpEO0FBZlksc0NBQWEifQ==