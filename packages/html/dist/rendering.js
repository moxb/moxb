"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var UIFragment_1 = require("./UIFragment");
var UIFragmentSpec_1 = require("./UIFragmentSpec");
function renderFallback(props) {
    var filterCondition = props.filterCondition, fallback = props.fallback, part = props.part, parsedTokens = props.parsedTokens;
    var navigableChildParams = {
        parsedTokens: parsedTokens,
        filterCondition: filterCondition,
        fallback: fallback,
        part: part,
    };
    var fallbackFragment = UIFragmentSpec_1.extractUIFragmentFromSpec({}, fallback, part);
    return UIFragment_1.renderUIFragment(fallbackFragment, navigableChildParams);
}
exports.renderFallback = renderFallback;
function renderSubStateCore(props) {
    var state = props.state, navigationContext = props.navigationContext, _a = props.tokenIncrease, tokenIncrease = _a === void 0 ? 0 : _a, _b = props.extraProps, extraProps = _b === void 0 ? {} : _b, checkCondition = props.checkCondition, navControl = props.navControl;
    var filterCondition = navigationContext.filterCondition, parsedTokens = navigationContext.parsedTokens, fallback = navigationContext.fallback, part = navigationContext.part;
    if (checkCondition && state && state.data && filterCondition) {
        if (!filterCondition(state.data)) {
            return renderFallback(navigationContext);
        }
    }
    var navigableChildParams = {
        parsedTokens: (parsedTokens || 0) + tokenIncrease,
        fallback: fallback,
        filterCondition: filterCondition,
        part: part,
        navControl: navControl,
    };
    var childProps = tslib_1.__assign(tslib_1.__assign({}, extraProps), navigableChildParams);
    var fragment = UIFragmentSpec_1.extractUIFragmentFromSpec((state || {}).fragment, fallback, part);
    return UIFragment_1.renderUIFragment(fragment, childProps);
}
exports.renderSubStateCore = renderSubStateCore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JlbmRlcmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwyQ0FBZ0Q7QUFDaEQsbURBQTZFO0FBRTdFLFNBQWdCLGNBQWMsQ0FBQyxLQUFxQztJQUN4RCxJQUFBLHVDQUFlLEVBQUUseUJBQVEsRUFBRSxpQkFBSSxFQUFFLGlDQUFZLENBQVc7SUFDaEUsSUFBTSxvQkFBb0IsR0FBbUM7UUFDekQsWUFBWSxjQUFBO1FBQ1osZUFBZSxpQkFBQTtRQUNmLFFBQVEsVUFBQTtRQUNSLElBQUksTUFBQTtLQUNQLENBQUM7SUFDRixJQUFNLGdCQUFnQixHQUFHLDBDQUF5QixDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkUsT0FBTyw2QkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFWRCx3Q0FVQztBQVdELFNBQWdCLGtCQUFrQixDQUFXLEtBQTRCO0lBQzdELElBQUEsbUJBQUssRUFBRSwyQ0FBaUIsRUFBRSx3QkFBaUIsRUFBakIsc0NBQWlCLEVBQUUscUJBQWUsRUFBZixvQ0FBZSxFQUFFLHFDQUFjLEVBQUUsNkJBQVUsQ0FBVztJQUNuRyxJQUFBLG1EQUFlLEVBQUUsNkNBQVksRUFBRSxxQ0FBUSxFQUFFLDZCQUFJLENBQXVCO0lBQzVFLElBQUksY0FBYyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLGVBQWUsRUFBRTtRQUMxRCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QixPQUFPLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQzVDO0tBQ0o7SUFDRCxJQUFNLG9CQUFvQixHQUErQztRQUNyRSxZQUFZLEVBQUUsQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsYUFBYTtRQUNqRCxRQUFRLFVBQUE7UUFDUixlQUFlLGlCQUFBO1FBQ2YsSUFBSSxNQUFBO1FBQ0osVUFBVSxZQUFBO0tBQ2IsQ0FBQztJQUNGLElBQU0sVUFBVSx5Q0FDVCxVQUFVLEdBQ1Ysb0JBQW9CLENBQzFCLENBQUM7SUFDRixJQUFNLFFBQVEsR0FBRywwQ0FBeUIsQ0FBQyxDQUFDLEtBQUssSUFBSyxFQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVGLE9BQU8sNkJBQWdCLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFyQkQsZ0RBcUJDIn0=