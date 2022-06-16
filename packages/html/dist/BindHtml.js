"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * This function essentially merges the BindAntProps with the data that comes form the operation.
 * The direct props override properties of the operation!
 */
function parseHtmlProps(bindProps, _op) {
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
exports.parseHtmlProps = parseHtmlProps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmluZEh0bWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQmluZEh0bWwudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU9BOzs7R0FHRztBQUNILFNBQWdCLGNBQWMsQ0FBTyxTQUFZLEVBQUUsR0FBTTtJQUNyRCxJQUFJLGNBQThGLEVBQTVGLFVBQUUsRUFBRSx3QkFBUyxFQUFFLHdCQUFTLEVBQUUsZ0JBQUssRUFBRSxzQkFBUSxFQUFFLHNCQUFRLEVBQUUsc0JBQVEsRUFBRSx5R0FBNkIsQ0FBQztJQUNuRyxFQUFFLEdBQUcsT0FBTyxFQUFFLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7SUFDdEQsS0FBSyxHQUFHLE9BQU8sS0FBSyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0lBQy9ELFFBQVEsR0FBRyxPQUFPLFFBQVEsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUMzRSxRQUFRLEdBQUcsT0FBTyxRQUFRLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDM0UsU0FBUyxHQUFHLE9BQU8sU0FBUyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO0lBQy9FLDBCQUNJLEVBQUUsSUFBQTtRQUNGLFNBQVMsV0FBQTtRQUNULEtBQUssT0FBQTtRQUNMLFFBQVEsVUFBQTtRQUNSLFFBQVEsVUFBQTtRQUNSLFNBQVMsV0FBQTtRQUNULFFBQVEsVUFBQSxJQUNMLEtBQUssRUFDVjtBQUNOLENBQUM7QUFqQkQsd0NBaUJDIn0=