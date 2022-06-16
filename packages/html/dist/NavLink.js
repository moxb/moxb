"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moxb_1 = require("@moxb/moxb");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var Anchor = require("./Anchor");
var NavLink = /** @class */ (function (_super) {
    tslib_1.__extends(NavLink, _super);
    function NavLink(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }
    /**
     * Calculate the location where this links should take us
     */
    NavLink.prototype.getWantedLocation = function () {
        var _a = this.props, position = _a.position, to = _a.to, argChanges = _a.argChanges, appendTokens = _a.appendTokens, removeTokenCount = _a.removeTokenCount, toRef = _a.toRef;
        return this.props.locationManager.getNewLocationForLinkProps({
            position: position,
            to: to,
            argChanges: argChanges,
            appendTokens: appendTokens,
            removeTokenCount: removeTokenCount,
            toRef: toRef,
        });
    };
    NavLink.prototype.handleClick = function () {
        this.props.locationManager.trySetLocation(this.getWantedLocation());
    };
    NavLink.prototype.render = function () {
        var _a = this.props, children = _a.children, remnants = tslib_1.__rest(_a, ["children"]);
        var target = this.props.target;
        return (React.createElement(Anchor.Anchor, tslib_1.__assign({ href: moxb_1.locationToUrl(this.getWantedLocation()), onClick: target ? undefined : this.handleClick }, remnants), children));
    };
    NavLink = tslib_1.__decorate([
        mobx_react_1.inject('locationManager'),
        mobx_react_1.observer
        /**
         * A simple path-changing link component
         */
    ], NavLink);
    return NavLink;
}(React.Component));
exports.NavLink = NavLink;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmF2TGluay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9OYXZMaW5rLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBb0Y7QUFDcEYseUNBQThDO0FBQzlDLDZCQUErQjtBQUMvQixpQ0FBbUM7QUFpQm5DO0lBQTZCLG1DQUE0QztJQUNyRSxpQkFBbUIsS0FBbUI7UUFBdEMsWUFDSSxrQkFBTSxLQUFLLENBQUMsU0FFZjtRQURHLEtBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLENBQUM7O0lBQ25ELENBQUM7SUFFRDs7T0FFRztJQUNPLG1DQUFpQixHQUEzQjtRQUNVLElBQUEsZUFBZ0YsRUFBOUUsc0JBQVEsRUFBRSxVQUFFLEVBQUUsMEJBQVUsRUFBRSw4QkFBWSxFQUFFLHNDQUFnQixFQUFFLGdCQUFvQixDQUFDO1FBQ3ZGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFnQixDQUFDLDBCQUEwQixDQUFDO1lBQzFELFFBQVEsVUFBQTtZQUNSLEVBQUUsSUFBQTtZQUNGLFVBQVUsWUFBQTtZQUNWLFlBQVksY0FBQTtZQUNaLGdCQUFnQixrQkFBQTtZQUNoQixLQUFLLE9BQUE7U0FDUixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRVMsNkJBQVcsR0FBckI7UUFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWdCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVNLHdCQUFNLEdBQWI7UUFDSSxJQUFNLGVBQXNDLEVBQXBDLHNCQUFRLEVBQUUsMkNBQTBCLENBQUM7UUFDckMsSUFBQSwwQkFBTSxDQUFnQjtRQUM5QixPQUFPLENBQ0gsb0JBQUMsTUFBTSxDQUFDLE1BQU0scUJBQ1YsSUFBSSxFQUFFLG9CQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsRUFDN0MsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUMxQyxRQUFRLEdBRVgsUUFBUSxDQUNHLENBQ25CLENBQUM7SUFDTixDQUFDO0lBckNRLE9BQU87UUFMbkIsbUJBQU0sQ0FBQyxpQkFBaUIsQ0FBQztRQUN6QixxQkFBUTtRQUNUOztXQUVHO09BQ1UsT0FBTyxDQXNDbkI7SUFBRCxjQUFDO0NBQUEsQUF0Q0QsQ0FBNkIsS0FBSyxDQUFDLFNBQVMsR0FzQzNDO0FBdENZLDBCQUFPIn0=