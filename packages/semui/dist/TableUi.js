"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var TableUi = /** @class */ (function (_super) {
    tslib_1.__extends(TableUi, _super);
    function TableUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableUi.prototype.render = function () {
        var _a = this.props, children = _a.children, table = _a.table, hideHeader = _a.hideHeader, tableProps = tslib_1.__rest(_a, ["children", "table", "hideHeader"]);
        return (React.createElement(semantic_ui_react_1.Table, tslib_1.__assign({ sortable: true, compact: true, celled: true, striped: true }, tableProps),
            !hideHeader && (React.createElement(semantic_ui_react_1.Table.Header, { className: "tye_bindTable" },
                React.createElement(semantic_ui_react_1.Table.Row, null, table.columns.map(function (column, idx) { return (React.createElement(semantic_ui_react_1.Table.HeaderCell, { key: idx, onClick: column.toggleSort, sorted: column.sortDirection, className: column.sortDirection ? 'sortable' : '', width: column.width }, column.label)); })))),
            React.createElement(semantic_ui_react_1.Table.Body, null, children)));
    };
    TableUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], TableUi);
    return TableUi;
}(React.Component));
exports.TableUi = TableUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVVaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UYWJsZVVpLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5Q0FBc0M7QUFDdEMsNkJBQStCO0FBQy9CLHVEQUFzRDtBQVV0RDtJQUE2QixtQ0FBNkI7SUFBMUQ7O0lBMEJBLENBQUM7SUF6Qkcsd0JBQU0sR0FBTjtRQUNJLElBQU0sZUFBMkQsRUFBekQsc0JBQVEsRUFBRSxnQkFBSyxFQUFFLDBCQUFVLEVBQUUsb0VBQTRCLENBQUM7UUFDbEUsT0FBTyxDQUNILG9CQUFDLHlCQUFLLHFCQUFDLFFBQVEsUUFBQyxPQUFPLFFBQUMsTUFBTSxRQUFDLE9BQU8sVUFBSyxVQUFVO1lBQ2hELENBQUMsVUFBVSxJQUFJLENBQ1osb0JBQUMseUJBQUssQ0FBQyxNQUFNLElBQUMsU0FBUyxFQUFDLGVBQWU7Z0JBQ25DLG9CQUFDLHlCQUFLLENBQUMsR0FBRyxRQUNMLEtBQUssQ0FBQyxPQUFRLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLEdBQVcsSUFBSyxPQUFBLENBQ3pDLG9CQUFDLHlCQUFLLENBQUMsVUFBVSxJQUNiLEdBQUcsRUFBRSxHQUFHLEVBQ1IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQzFCLE1BQU0sRUFBRSxNQUFNLENBQUMsYUFBYSxFQUM1QixTQUFTLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQ2pELEtBQUssRUFBRSxNQUFNLENBQUMsS0FBWSxJQUV6QixNQUFNLENBQUMsS0FBSyxDQUNFLENBQ3RCLEVBVjRDLENBVTVDLENBQUMsQ0FDTSxDQUNELENBQ2xCO1lBQ0Qsb0JBQUMseUJBQUssQ0FBQyxJQUFJLFFBQUUsUUFBUSxDQUFjLENBQy9CLENBQ1gsQ0FBQztJQUNOLENBQUM7SUF6QlEsT0FBTztRQURuQixxQkFBUTtPQUNJLE9BQU8sQ0EwQm5CO0lBQUQsY0FBQztDQUFBLEFBMUJELENBQTZCLEtBQUssQ0FBQyxTQUFTLEdBMEIzQztBQTFCWSwwQkFBTyJ9