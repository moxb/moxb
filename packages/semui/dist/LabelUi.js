"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var marked = require("marked");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var BindUi_1 = require("./BindUi");
var LabelUi = /** @class */ (function (_super) {
    tslib_1.__extends(LabelUi, _super);
    function LabelUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LabelUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, props = tslib_1.__rest(_a, ["operation"]);
        var escapedText = operation.showRawText ? operation.text : operation.text.replace(/<[^>]+>/g, '');
        return React.createElement("div", tslib_1.__assign({}, props), escapedText);
    };
    LabelUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], LabelUi);
    return LabelUi;
}(React.Component));
exports.LabelUi = LabelUi;
var LabelMarkdownUi = /** @class */ (function (_super) {
    tslib_1.__extends(LabelMarkdownUi, _super);
    function LabelMarkdownUi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LabelMarkdownUi.prototype.render = function () {
        var _a = BindUi_1.parseProps(this.props), operation = _a.operation, props = tslib_1.__rest(_a, ["operation"]);
        var html = !operation.showRawText ? BindUi_1.stripSurroundingP(marked(operation.text || '')) : operation.text;
        return React.createElement("div", tslib_1.__assign({ dangerouslySetInnerHTML: { __html: html } }, props));
    };
    LabelMarkdownUi = tslib_1.__decorate([
        mobx_react_1.observer
    ], LabelMarkdownUi);
    return LabelMarkdownUi;
}(React.Component));
exports.LabelMarkdownUi = LabelMarkdownUi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFiZWxVaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9MYWJlbFVpLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBaUM7QUFDakMseUNBQXNDO0FBQ3RDLDZCQUErQjtBQUMvQixtQ0FBeUQ7QUFPekQ7SUFBNkIsbUNBQWtDO0lBQS9EOztJQU1BLENBQUM7SUFMRyx3QkFBTSxHQUFOO1FBQ0ksSUFBTSxvQ0FBZ0QsRUFBOUMsd0JBQVMsRUFBRSx5Q0FBbUMsQ0FBQztRQUN2RCxJQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdEcsT0FBTyxnREFBUyxLQUFLLEdBQUcsV0FBVyxDQUFPLENBQUM7SUFDL0MsQ0FBQztJQUxRLE9BQU87UUFEbkIscUJBQVE7T0FDSSxPQUFPLENBTW5CO0lBQUQsY0FBQztDQUFBLEFBTkQsQ0FBNkIsS0FBSyxDQUFDLFNBQVMsR0FNM0M7QUFOWSwwQkFBTztBQVNwQjtJQUFxQywyQ0FBa0M7SUFBdkU7O0lBTUEsQ0FBQztJQUxHLGdDQUFNLEdBQU47UUFDSSxJQUFNLG9DQUFnRCxFQUE5Qyx3QkFBUyxFQUFFLHlDQUFtQyxDQUFDO1FBQ3ZELElBQU0sSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsMEJBQWlCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUssQ0FBQztRQUN4RyxPQUFPLDhDQUFLLHVCQUF1QixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFNLEtBQUssRUFBSSxDQUFDO0lBQ3pFLENBQUM7SUFMUSxlQUFlO1FBRDNCLHFCQUFRO09BQ0ksZUFBZSxDQU0zQjtJQUFELHNCQUFDO0NBQUEsQUFORCxDQUFxQyxLQUFLLENBQUMsU0FBUyxHQU1uRDtBQU5ZLDBDQUFlIn0=