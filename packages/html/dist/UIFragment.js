"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var isForwardRef_1 = require("./isForwardRef");
/**
 * This function will render any UIFragment.
 *
 * When rendering a component, it also accepts some props.
 */
exports.renderUIFragment = function (fragment, props) {
    if (props === void 0) { props = {}; }
    if (fragment === undefined) {
        return null;
    }
    // console.log('Rendering fragment', typeof fragment, fragment, (fragment as any).type, typeof (fragment as any).type);
    if (typeof fragment === 'function' ||
        isForwardRef_1.isForwardRef(fragment) ||
        (typeof fragment === 'object' &&
            typeof fragment.type === 'function' &&
            fragment.$$typeof !== Symbol.for('react.element'))) {
        // console.log('using createElement');
        return React.createElement(fragment, props);
    }
    else {
        // console.log('Rendering this directly');
        return fragment;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlGcmFnbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9VSUZyYWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQStCO0FBQy9CLCtDQUE4QztBQVk5Qzs7OztHQUlHO0FBQ1UsUUFBQSxnQkFBZ0IsR0FBRyxVQUFDLFFBQWdDLEVBQUUsS0FBa0I7SUFBbEIsc0JBQUEsRUFBQSxVQUFrQjtJQUNqRixJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7UUFDeEIsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELHVIQUF1SDtJQUN2SCxJQUNJLE9BQU8sUUFBUSxLQUFLLFVBQVU7UUFDOUIsMkJBQVksQ0FBQyxRQUFRLENBQUM7UUFDdEIsQ0FBQyxPQUFPLFFBQVEsS0FBSyxRQUFRO1lBQ3pCLE9BQVEsUUFBZ0IsQ0FBQyxJQUFJLEtBQUssVUFBVTtZQUMzQyxRQUFnQixDQUFDLFFBQVEsS0FBSyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQ2pFO1FBQ0Usc0NBQXNDO1FBQ3RDLE9BQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDdEQ7U0FBTTtRQUNILDBDQUEwQztRQUMxQyxPQUFPLFFBQXVCLENBQUM7S0FDbEM7QUFDTCxDQUFDLENBQUMifQ==