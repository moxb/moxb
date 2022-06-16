"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var TablePaginationUi = /** @class */ (function (_super) {
    tslib_1.__extends(TablePaginationUi, _super);
    function TablePaginationUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TablePaginationUi.prototype.render = function () {
        var _a = this.props, pagination = _a.pagination, noAlignment = _a.noAlignment, paginationProps = tslib_1.__rest(_a, ["pagination", "noAlignment"]);
        var options = pagination.pageSizes.map(function (value) { return ({ key: value, text: '' + value, value: value }); });
        if (!pagination.visible) {
            return null;
        }
        return (React.createElement("div", { className: noAlignment ? undefined : 'container ui', style: { marginTop: '20px' } },
            React.createElement(semantic_ui_react_1.Pagination, tslib_1.__assign({ onPageChange: function (_event, data) { return pagination.setActivePage(data.activePage); }, activePage: pagination.activePage, totalPages: pagination.totalPages, firstItem: {
                    'aria-label': moxb_1.t('TablePaginationUi.buttons.firstItem', 'First item'),
                    content: '«',
                    disabled: !pagination.hasPrevPage,
                }, prevItem: {
                    'aria-label': moxb_1.t('TablePaginationUi.buttons.previousItem', 'Previous item'),
                    content: '⟨',
                    disabled: !pagination.hasPrevPage,
                }, lastItem: {
                    'aria-label': moxb_1.t('TablePaginationUi.buttons.lastItem', 'Last item'),
                    content: '»',
                    disabled: !pagination.hasNextPage,
                }, nextItem: {
                    'aria-label': moxb_1.t('TablePaginationUi.buttons.nextItem', 'Next item'),
                    content: '⟩',
                    disabled: !pagination.hasNextPage,
                } }, paginationProps)),
            React.createElement("span", { style: { marginLeft: '10px' } },
                moxb_1.t('TablePaginationUi.dropdown.show', 'Show'),
                React.createElement(semantic_ui_react_1.Dropdown, { item: true, simple: true, value: pagination.pageSize, onChange: function (_event, data) { return pagination.setPageSize(data.value); }, style: { margin: '0 10px' }, options: options })),
            moxb_1.t('TablePaginationUi.dropdown.entries', 'entries')));
    };
    TablePaginationUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], TablePaginationUi);
    return TablePaginationUi;
}(React.Component));
exports.TablePaginationUi = TablePaginationUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVQYWdpbmF0aW9uVWkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVGFibGVQYWdpbmF0aW9uVWkudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFnRDtBQUNoRCx5Q0FBc0M7QUFDdEMsNkJBQStCO0FBQy9CLHVEQUF5RDtBQVF6RDtJQUF1Qyw2Q0FBMkM7SUFBbEY7O0lBa0RBLENBQUM7SUFqREcsa0NBQU0sR0FBTjtRQUNJLElBQU0sZUFBNEQsRUFBMUQsMEJBQVUsRUFBRSw0QkFBVyxFQUFFLG1FQUFpQyxDQUFDO1FBQ25FLElBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxJQUFLLE9BQUEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxFQUF6QyxDQUF5QyxDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUU7WUFDckIsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sQ0FDSCw2QkFBSyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO1lBQ2xGLG9CQUFDLDhCQUFVLHFCQUNQLFlBQVksRUFBRSxVQUFDLE1BQU0sRUFBRSxJQUFJLElBQUssT0FBQSxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFvQixDQUFDLEVBQW5ELENBQW1ELEVBQ25GLFVBQVUsRUFBRSxVQUFVLENBQUMsVUFBVSxFQUNqQyxVQUFVLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFDakMsU0FBUyxFQUFFO29CQUNQLFlBQVksRUFBRSxRQUFDLENBQUMscUNBQXFDLEVBQUUsWUFBWSxDQUFDO29CQUNwRSxPQUFPLEVBQUUsR0FBRztvQkFDWixRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVztpQkFDcEMsRUFDRCxRQUFRLEVBQUU7b0JBQ04sWUFBWSxFQUFFLFFBQUMsQ0FBQyx3Q0FBd0MsRUFBRSxlQUFlLENBQUM7b0JBQzFFLE9BQU8sRUFBRSxHQUFHO29CQUNaLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXO2lCQUNwQyxFQUNELFFBQVEsRUFBRTtvQkFDTixZQUFZLEVBQUUsUUFBQyxDQUFDLG9DQUFvQyxFQUFFLFdBQVcsQ0FBQztvQkFDbEUsT0FBTyxFQUFFLEdBQUc7b0JBQ1osUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVc7aUJBQ3BDLEVBQ0QsUUFBUSxFQUFFO29CQUNOLFlBQVksRUFBRSxRQUFDLENBQUMsb0NBQW9DLEVBQUUsV0FBVyxDQUFDO29CQUNsRSxPQUFPLEVBQUUsR0FBRztvQkFDWixRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVztpQkFDcEMsSUFDRyxlQUFlLEVBQ3JCO1lBQ0YsOEJBQU0sS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTtnQkFDOUIsUUFBQyxDQUFDLGlDQUFpQyxFQUFFLE1BQU0sQ0FBQztnQkFDN0Msb0JBQUMsNEJBQVEsSUFDTCxJQUFJLFFBQ0osTUFBTSxRQUNOLEtBQUssRUFBRSxVQUFVLENBQUMsUUFBUSxFQUMxQixRQUFRLEVBQUUsVUFBQyxNQUFNLEVBQUUsSUFBSSxJQUFLLE9BQUEsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBZSxDQUFDLEVBQTVDLENBQTRDLEVBQ3hFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFDM0IsT0FBTyxFQUFFLE9BQU8sR0FDbEIsQ0FDQztZQUNOLFFBQUMsQ0FBQyxvQ0FBb0MsRUFBRSxTQUFTLENBQUMsQ0FDakQsQ0FDVCxDQUFDO0lBQ04sQ0FBQztJQWpEUSxpQkFBaUI7UUFEN0IscUJBQVE7T0FDSSxpQkFBaUIsQ0FrRDdCO0lBQUQsd0JBQUM7Q0FBQSxBQWxERCxDQUF1QyxLQUFLLENBQUMsU0FBUyxHQWtEckQ7QUFsRFksOENBQWlCIn0=