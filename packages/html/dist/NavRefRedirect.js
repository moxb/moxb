"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mobx_1 = require("mobx");
var moxb_1 = require("@moxb/moxb");
var mobx_react_1 = require("mobx-react");
var React = require("react");
/**
 * The NavRefRedirect component is responsible for executing redirects based on base64-encoded
 * NavRef links.
 *
 * Just put it into a menu (under the preferred url prefix used for the redirects),
 * and it will handle the rest. Ie.
 *
 *  {
 *     key: 'redirects',
 *     hidden: true,
 *     fragment: NavRefRedirect,
 *  },
 *
 */
var NavRefRedirect = /** @class */ (function (_super) {
    tslib_1.__extends(NavRefRedirect, _super);
    function NavRefRedirect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._failed = false;
        return _this;
    }
    NavRefRedirect.prototype._tryRedirect = function () {
        this._failed = false;
        try {
            // Get the data out of the next path token
            var stringForm = moxb_1.getNextPathToken(this.props);
            // Parse the base64 data into a NavRefCall data structure
            var _a = moxb_1.parseNavRef(stringForm), navRef = _a.navRef, tokens = _a.tokens;
            // Go to this NavRef
            this.props.linkGenerator.doGoTo(navRef.call(tokens), moxb_1.UpdateMethod.REPLACE);
        }
        catch (e) {
            this._failed = true;
            console.log(e);
        }
    };
    NavRefRedirect.prototype.componentDidMount = function () {
        this._tryRedirect();
    };
    NavRefRedirect.prototype.componentDidUpdate = function () {
        this._tryRedirect();
    };
    NavRefRedirect.prototype.render = function () {
        return this._failed ? React.createElement("div", null, "Oops! This redirect doesn't seem to be working.") : React.createElement("div", null, "Redirecting...");
    };
    tslib_1.__decorate([
        mobx_1.observable
    ], NavRefRedirect.prototype, "_failed", void 0);
    NavRefRedirect = tslib_1.__decorate([
        mobx_react_1.inject('locationManager', 'linkGenerator'),
        mobx_react_1.observer
    ], NavRefRedirect);
    return NavRefRedirect;
}(React.Component));
exports.NavRefRedirect = NavRefRedirect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmF2UmVmUmVkaXJlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTmF2UmVmUmVkaXJlY3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUFrQztBQUNsQyxtQ0FBcUg7QUFDckgseUNBQThDO0FBQzlDLDZCQUErQjtBQUUvQjs7Ozs7Ozs7Ozs7OztHQWFHO0FBR0g7SUFBb0MsMENBQXVFO0lBQTNHO1FBQUEscUVBZ0NDO1FBOUJXLGFBQU8sR0FBRyxLQUFLLENBQUM7O0lBOEI1QixDQUFDO0lBNUJXLHFDQUFZLEdBQXBCO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSTtZQUNBLDBDQUEwQztZQUMxQyxJQUFNLFVBQVUsR0FBRyx1QkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFaEQseURBQXlEO1lBQ25ELElBQUEsbUNBQTRDLEVBQTFDLGtCQUFNLEVBQUUsa0JBQWtDLENBQUM7WUFFbkQsb0JBQW9CO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLG1CQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDL0U7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7SUFDTCxDQUFDO0lBRUQsMENBQWlCLEdBQWpCO1FBQ0ksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCwyQ0FBa0IsR0FBbEI7UUFDSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELCtCQUFNLEdBQU47UUFDSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG1GQUEwRCxDQUFDLENBQUMsQ0FBQyxrREFBeUIsQ0FBQztJQUNqSCxDQUFDO0lBN0JEO1FBREMsaUJBQVU7bURBQ2E7SUFGZixjQUFjO1FBRjFCLG1CQUFNLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDO1FBQzFDLHFCQUFRO09BQ0ksY0FBYyxDQWdDMUI7SUFBRCxxQkFBQztDQUFBLEFBaENELENBQW9DLEtBQUssQ0FBQyxTQUFTLEdBZ0NsRDtBQWhDWSx3Q0FBYyJ9