"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var marked = require("marked");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
/**
 * This function essentially merges the BindUiProps with the data that comes form the operation.
 * The direct props override properties of the operation!
 */
function parseProps(bindProps) {
    var _a = bindProps, id = _a.id, operation = _a.operation, invisible = _a.invisible, label = _a.label, disabled = _a.disabled, readOnly = _a.readOnly, children = _a.children, props = tslib_1.__rest(_a, ["id", "operation", "invisible", "label", "disabled", "readOnly", "children"]);
    id = typeof id !== 'undefined' ? id : operation.domId;
    label = typeof label !== 'undefined' ? label : operation.label;
    disabled = typeof disabled !== 'undefined' ? disabled : operation.disabled;
    readOnly = typeof readOnly !== 'undefined' ? readOnly : operation.readOnly;
    invisible = typeof invisible !== 'undefined' ? invisible : operation.invisible;
    return tslib_1.__assign({ id: id,
        operation: operation,
        label: label,
        disabled: disabled,
        readOnly: readOnly,
        invisible: invisible,
        children: children }, props);
}
exports.parseProps = parseProps;
//trigger={<Button basic icon="help" circular size="mini" />}
// trigger={<sup><Icon name="help circle outline" /></sup>}
// trigger={<sup><Button style={{fontSize:"0.5rem"}} basic icon="help" circular compact size="mini" color='grey' /></sup>}
function labelWithHelp(label, help) {
    // help=`# This is help for *${label}*\n\nand the body\n\nwith **multiple** paragraphs.`;
    if (help && typeof label === 'string') {
        return (React.createElement("label", null,
            label,
            ' ',
            React.createElement(semantic_ui_react_1.Popup, { trigger: React.createElement(semantic_ui_react_1.Icon, { name: "question circle outline" }), on: ['hover', 'click' /*click requires the trigger to be an icon*/] },
                React.createElement("div", { dangerouslySetInnerHTML: { __html: marked(help) } }))));
    }
    else {
        return label;
    }
}
exports.labelWithHelp = labelWithHelp;
/**
 * Remove a `<p>...</p>` that surrounds the html.
 * @param html
 */
function stripSurroundingP(html) {
    return html.replace(/^\s*<p>/, '').replace(/<\/p>\s*$/, '');
}
exports.stripSurroundingP = stripSurroundingP;
var BindMarkdownDiv = /** @class */ (function (_super) {
    tslib_1.__extends(BindMarkdownDiv, _super);
    function BindMarkdownDiv() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BindMarkdownDiv.prototype.render = function () {
        var _a = this.props, markdownText = _a.markdownText, props = tslib_1.__rest(_a, ["markdownText"]);
        var html = stripSurroundingP(marked(markdownText));
        return React.createElement("div", tslib_1.__assign({ dangerouslySetInnerHTML: { __html: html } }, props));
    };
    return BindMarkdownDiv;
}(React.Component));
exports.BindMarkdownDiv = BindMarkdownDiv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmluZFVpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0JpbmRVaS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0JBQWlDO0FBQ2pDLDZCQUErQjtBQUUvQix1REFBZ0Q7QUFPaEQ7OztHQUdHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFJLFNBQVk7SUFDdEMsSUFBSSxjQUE4RixFQUE1RixVQUFFLEVBQUUsd0JBQVMsRUFBRSx3QkFBUyxFQUFFLGdCQUFLLEVBQUUsc0JBQVEsRUFBRSxzQkFBUSxFQUFFLHNCQUFRLEVBQUUseUdBQTZCLENBQUM7SUFDbkcsRUFBRSxHQUFHLE9BQU8sRUFBRSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0lBQ3RELEtBQUssR0FBRyxPQUFPLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztJQUMvRCxRQUFRLEdBQUcsT0FBTyxRQUFRLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDM0UsUUFBUSxHQUFHLE9BQU8sUUFBUSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0lBQzNFLFNBQVMsR0FBRyxPQUFPLFNBQVMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztJQUMvRSwwQkFDSSxFQUFFLElBQUE7UUFDRixTQUFTLFdBQUE7UUFDVCxLQUFLLE9BQUE7UUFDTCxRQUFRLFVBQUE7UUFDUixRQUFRLFVBQUE7UUFDUixTQUFTLFdBQUE7UUFDVCxRQUFRLFVBQUEsSUFDTCxLQUFLLEVBQ1Y7QUFDTixDQUFDO0FBakJELGdDQWlCQztBQUNELDZEQUE2RDtBQUM3RCwyREFBMkQ7QUFDM0QsMEhBQTBIO0FBRTFILFNBQWdCLGFBQWEsQ0FBQyxLQUFVLEVBQUUsSUFBYTtJQUNuRCx5RkFBeUY7SUFDekYsSUFBSSxJQUFJLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQ25DLE9BQU8sQ0FDSDtZQUNLLEtBQUs7WUFBRSxHQUFHO1lBQ1gsb0JBQUMseUJBQUssSUFDRixPQUFPLEVBQUUsb0JBQUMsd0JBQUksSUFBQyxJQUFJLEVBQUMseUJBQXlCLEdBQUcsRUFDaEQsRUFBRSxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQztnQkFFbkUsNkJBQUssdUJBQXVCLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUksQ0FDdEQsQ0FDSixDQUNYLENBQUM7S0FDTDtTQUFNO1FBQ0gsT0FBTyxLQUFLLENBQUM7S0FDaEI7QUFDTCxDQUFDO0FBakJELHNDQWlCQztBQUNEOzs7R0FHRztBQUNILFNBQWdCLGlCQUFpQixDQUFDLElBQVk7SUFDMUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUFGRCw4Q0FFQztBQUVEO0lBQXFDLDJDQUEyRTtJQUFoSDs7SUFNQSxDQUFDO0lBTEcsZ0NBQU0sR0FBTjtRQUNJLElBQU0sZUFBdUMsRUFBckMsOEJBQVksRUFBRSw0Q0FBdUIsQ0FBQztRQUM5QyxJQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUNyRCxPQUFPLDhDQUFLLHVCQUF1QixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFNLEtBQUssRUFBSSxDQUFDO0lBQ3pFLENBQUM7SUFDTCxzQkFBQztBQUFELENBQUMsQUFORCxDQUFxQyxLQUFLLENBQUMsU0FBUyxHQU1uRDtBQU5ZLDBDQUFlIn0=