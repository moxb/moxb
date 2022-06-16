"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
/**
 * Pad numbers with a 0 if necessary.
 *
 * (ie. 8 -> "08")
 */
var padNumber = function (x) {
    var int = Math.floor(x);
    return int < 10 ? '0' + int : '' + int;
};
/**
 * Format seconds as a clock.
 *
 * (ie. 80 -> 01:20)
 */
var formatSecs = function (secs) {
    return secs > 3600
        ? padNumber(secs / 3600) + ':' + padNumber((secs % 3600) / 60) + ':' + padNumber(secs % 60)
        : padNumber(secs / 60) + ':' + padNumber(secs % 60);
};
/**
 * This widget can display an amount of time, like a clock.
 *
 * It can count forward, it can count backwards, and in can also show a fixed amount of time.
 */
var CountingClock = /** @class */ (function (_super) {
    tslib_1.__extends(CountingClock, _super);
    function CountingClock(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            display: '',
        };
        return _this;
    }
    CountingClock.prototype.update = function () {
        var formatted;
        var _a = this.props, measureSince = _a.measureSince, countdownTo = _a.countdownTo, fixedAmount = _a.fixedAmount, postFormatter = _a.postFormatter;
        if (measureSince) {
            formatted = formatSecs((Date.now() - measureSince) / 1000);
        }
        else if (countdownTo) {
            var remaining = (countdownTo - Date.now()) / 1000;
            formatted = remaining > 0 ? formatSecs(remaining) : '';
        }
        else if (fixedAmount) {
            formatted = formatSecs(fixedAmount);
        }
        else {
            formatted = '';
        }
        if (postFormatter && !!formatted) {
            formatted = postFormatter(formatted);
        }
        if (this.state.display !== formatted) {
            this.setState({
                display: formatted,
            });
        }
    };
    Object.defineProperty(CountingClock.prototype, "shouldRun", {
        get: function () {
            var _a = this.props, measureSince = _a.measureSince, countdownTo = _a.countdownTo;
            return !!measureSince || !!countdownTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CountingClock.prototype, "isRunning", {
        get: function () {
            return !!this.timerId;
        },
        enumerable: true,
        configurable: true
    });
    CountingClock.prototype.startOrStopAndUpdate = function () {
        var _this = this;
        var _a = this, shouldRun = _a.shouldRun, isRunning = _a.isRunning;
        if (shouldRun && !isRunning) {
            this.timerId = setInterval(function () { return _this.update(); }, 1000);
        }
        else if (!shouldRun && isRunning) {
            clearInterval(this.timerId);
            this.update();
            delete this.timerId;
        }
        else {
            this.update();
        }
    };
    CountingClock.prototype.componentDidMount = function () {
        this.startOrStopAndUpdate();
    };
    CountingClock.prototype.componentDidUpdate = function () {
        this.startOrStopAndUpdate();
    };
    CountingClock.prototype.componentWillUnmount = function () {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    };
    CountingClock.prototype.render = function () {
        var _a = this.props, measureSince = _a.measureSince, countdownTo = _a.countdownTo, fixedAmount = _a.fixedAmount, _b = _a.classNames, classNames = _b === void 0 ? '' : _b, _c = _a.style, style = _c === void 0 ? {} : _c, help = _a.help;
        var present = 0;
        if (!!measureSince) {
            present++;
        }
        if (!!countdownTo) {
            present++;
        }
        if (!!fixedAmount) {
            present++;
        }
        if (present > 1) {
            throw new Error('You should never provide more than one of the three multiple exclusionary input args: countdownTo, measureSince, fixedAmount');
        }
        return present ? (React.createElement("span", { style: style, className: 'clockCounter ' + classNames, title: help }, this.state.display)) : null;
    };
    return CountingClock;
}(React.Component));
exports.CountingClock = CountingClock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ291bnRpbmdDbG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Db3VudGluZ0Nsb2NrLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBK0I7QUErQy9COzs7O0dBSUc7QUFDSCxJQUFNLFNBQVMsR0FBRyxVQUFDLENBQVM7SUFDeEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDM0MsQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNILElBQU0sVUFBVSxHQUFHLFVBQUMsSUFBWTtJQUM1QixPQUFBLElBQUksR0FBRyxJQUFJO1FBQ1AsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDM0YsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRnZELENBRXVELENBQUM7QUFFNUQ7Ozs7R0FJRztBQUNIO0lBQW1DLHlDQUErQztJQUM5RSx1QkFBWSxLQUF5QjtRQUFyQyxZQUNJLGtCQUFNLEtBQUssQ0FBQyxTQUlmO1FBSEcsS0FBSSxDQUFDLEtBQUssR0FBRztZQUNULE9BQU8sRUFBRSxFQUFFO1NBQ2QsQ0FBQzs7SUFDTixDQUFDO0lBRU8sOEJBQU0sR0FBZDtRQUNJLElBQUksU0FBaUIsQ0FBQztRQUNoQixJQUFBLGVBQXNFLEVBQXBFLDhCQUFZLEVBQUUsNEJBQVcsRUFBRSw0QkFBVyxFQUFFLGdDQUE0QixDQUFDO1FBQzdFLElBQUksWUFBWSxFQUFFO1lBQ2QsU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUM5RDthQUFNLElBQUksV0FBVyxFQUFFO1lBQ3BCLElBQU0sU0FBUyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNwRCxTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDMUQ7YUFBTSxJQUFJLFdBQVcsRUFBRTtZQUNwQixTQUFTLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3ZDO2FBQU07WUFDSCxTQUFTLEdBQUcsRUFBRSxDQUFDO1NBQ2xCO1FBQ0QsSUFBSSxhQUFhLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRTtZQUM5QixTQUFTLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDVixPQUFPLEVBQUUsU0FBUzthQUNyQixDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFJRCxzQkFBWSxvQ0FBUzthQUFyQjtZQUNVLElBQUEsZUFBMEMsRUFBeEMsOEJBQVksRUFBRSw0QkFBMEIsQ0FBQztZQUNqRCxPQUFPLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUMzQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFZLG9DQUFTO2FBQXJCO1lBQ0ksT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMxQixDQUFDOzs7T0FBQTtJQUVPLDRDQUFvQixHQUE1QjtRQUFBLGlCQVdDO1FBVlMsSUFBQSxTQUErQixFQUE3Qix3QkFBUyxFQUFFLHdCQUFrQixDQUFDO1FBQ3RDLElBQUksU0FBUyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxFQUFFLEVBQWIsQ0FBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pEO2FBQU0sSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLEVBQUU7WUFDaEMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDdkI7YUFBTTtZQUNILElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNqQjtJQUNMLENBQUM7SUFFRCx5Q0FBaUIsR0FBakI7UUFDSSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsMENBQWtCLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELDRDQUFvQixHQUFwQjtRQUNJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDL0I7SUFDTCxDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNVLElBQUEsZUFBMEYsRUFBeEYsOEJBQVksRUFBRSw0QkFBVyxFQUFFLDRCQUFXLEVBQUUsa0JBQWUsRUFBZixvQ0FBZSxFQUFFLGFBQVUsRUFBViwrQkFBVSxFQUFFLGNBQW1CLENBQUM7UUFDakcsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRTtZQUNoQixPQUFPLEVBQUUsQ0FBQztTQUNiO1FBQ0QsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFO1lBQ2YsT0FBTyxFQUFFLENBQUM7U0FDYjtRQUNELElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRTtZQUNmLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFDRCxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7WUFDYixNQUFNLElBQUksS0FBSyxDQUNYLDhIQUE4SCxDQUNqSSxDQUFDO1NBQ0w7UUFDRCxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FDYiw4QkFBTSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxlQUFlLEdBQUcsVUFBVSxFQUFFLEtBQUssRUFBRSxJQUFJLElBQ25FLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUNoQixDQUNWLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFDTCxvQkFBQztBQUFELENBQUMsQUE1RkQsQ0FBbUMsS0FBSyxDQUFDLFNBQVMsR0E0RmpEO0FBNUZZLHNDQUFhIn0=