"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
// forward references
var empty = function (_props, _ref) { };
exports.ReactForwardRefSymbol = typeof react_1.forwardRef === 'function' && react_1.forwardRef(empty).$$typeof;
// this should return component is ForwardRef, but React has no ForwardRef type...
function isForwardRef(component) {
    if (!component || typeof component !== 'object') {
        return false;
    }
    return component.$$typeof === exports.ReactForwardRefSymbol;
}
exports.isForwardRef = isForwardRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNGb3J3YXJkUmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2lzRm9yd2FyZFJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFtQztBQUVuQyxxQkFBcUI7QUFDckIsSUFBTSxLQUFLLEdBQVEsVUFBQyxNQUFXLEVBQUUsSUFBUyxJQUFNLENBQUMsQ0FBQztBQUNyQyxRQUFBLHFCQUFxQixHQUFHLE9BQU8sa0JBQVUsS0FBSyxVQUFVLElBQUksa0JBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFFcEcsa0ZBQWtGO0FBQ2xGLFNBQWdCLFlBQVksQ0FBQyxTQUFjO0lBQ3ZDLElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxFQUFFO1FBQzdDLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBRUQsT0FBTyxTQUFTLENBQUMsUUFBUSxLQUFLLDZCQUFxQixDQUFDO0FBQ3hELENBQUM7QUFORCxvQ0FNQyJ9