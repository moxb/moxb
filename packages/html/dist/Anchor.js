"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var UIFragment_1 = require("./UIFragment");
/**
 * A simple wrapper around the HTML anchor tag.
 */
var Anchor = /** @class */ (function (_super) {
    tslib_1.__extends(Anchor, _super);
    function Anchor(props) {
        var _this = _super.call(this, props) || this;
        // Is a native click event pending, that we want to suffice?
        _this.nativePending = false;
        _this.handleClick = _this.handleClick.bind(_this);
        _this.cancelEvent = _this.cancelEvent.bind(_this);
        return _this;
    }
    Anchor.prototype.cancelEvent = function (event) {
        if (this.nativePending) {
            // We want this click event to succeed, so don't cancel it
            // We only want to do this once per click, so clear the flag now
            this.nativePending = false;
            // cancel the cancellation
            return;
        }
        event.preventDefault();
        event.stopPropagation();
    };
    Anchor.prototype.handleClick = function (event) {
        var _a = this.props, onClick = _a.onClick, data = _a.data, disabled = _a.disabled;
        if (disabled) {
            // console.log('This anchor is currently disabled; ignoring click.');
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        var _b = event, button = _b.button, ctrlKey = _b.ctrlKey, metaKey = _b.metaKey;
        if (!onClick) {
            // console.log('No link handler, we will return 2');
            this.nativePending = true;
            return;
        }
        if (button) {
            // console.log('Ignoring click with middle or right button');
            this.nativePending = true;
            return;
        }
        if (ctrlKey || metaKey) {
            // console.log('Ignoring click with ctrlKey / metaKey 2');
            this.nativePending = true;
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        onClick(data);
    };
    // tslint:disable-next-line:cyclomatic-complexity
    Anchor.prototype.render = function () {
        var _a = this.props, label = _a.label, title = _a.title, children = _a.children, className = _a.className, style = _a.style, href = _a.href, target = _a.target, disabled = _a.disabled;
        var anchorProps = {
            href: href || '#',
            onMouseDown: this.handleClick,
            onClick: this.cancelEvent,
            title: title,
        };
        if (!!className || disabled) {
            anchorProps.className = (className || '') + (disabled ? ' disabled' : '');
        }
        if (target) {
            anchorProps.target = target;
        }
        if (style || disabled) {
            anchorProps.style = tslib_1.__assign(tslib_1.__assign({}, style), (disabled ? { cursor: 'not-allowed' } : {}));
        }
        return (React.createElement("a", tslib_1.__assign({}, anchorProps),
            UIFragment_1.renderUIFragment(label || ''),
            children));
    };
    return Anchor;
}(React.PureComponent));
exports.Anchor = Anchor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5jaG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0FuY2hvci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQStCO0FBQy9CLDJDQUE0RDtBQTZENUQ7O0dBRUc7QUFDSDtJQUE0QixrQ0FBNEI7SUFDcEQsZ0JBQW1CLEtBQWM7UUFBakMsWUFDSSxrQkFBTSxLQUFLLENBQUMsU0FHZjtRQUVELDREQUE0RDtRQUNwRCxtQkFBYSxHQUFHLEtBQUssQ0FBQztRQUwxQixLQUFJLENBQUMsV0FBVyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxDQUFDO1FBQy9DLEtBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLENBQUM7O0lBQ25ELENBQUM7SUFLTyw0QkFBVyxHQUFuQixVQUFvQixLQUE4QztRQUM5RCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEIsMERBQTBEO1lBRTFELGdFQUFnRTtZQUNoRSxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztZQUMzQiwwQkFBMEI7WUFDMUIsT0FBTztTQUNWO1FBQ0QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRU8sNEJBQVcsR0FBbkIsVUFBb0IsS0FBOEM7UUFDeEQsSUFBQSxlQUF3QyxFQUF0QyxvQkFBTyxFQUFFLGNBQUksRUFBRSxzQkFBdUIsQ0FBQztRQUMvQyxJQUFJLFFBQVEsRUFBRTtZQUNWLHFFQUFxRTtZQUNyRSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3hCLE9BQU87U0FDVjtRQUNLLElBQUEsVUFBMkMsRUFBekMsa0JBQU0sRUFBRSxvQkFBTyxFQUFFLG9CQUF3QixDQUFDO1FBQ2xELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDVixvREFBb0Q7WUFDcEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDMUIsT0FBTztTQUNWO1FBQ0QsSUFBSSxNQUFNLEVBQUU7WUFDUiw2REFBNkQ7WUFDN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDMUIsT0FBTztTQUNWO1FBQ0QsSUFBSSxPQUFPLElBQUksT0FBTyxFQUFFO1lBQ3BCLDBEQUEwRDtZQUMxRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixPQUFPO1NBQ1Y7UUFFRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsaURBQWlEO0lBQzFDLHVCQUFNLEdBQWI7UUFDVSxJQUFBLGVBQWlGLEVBQS9FLGdCQUFLLEVBQUUsZ0JBQUssRUFBRSxzQkFBUSxFQUFFLHdCQUFTLEVBQUUsZ0JBQUssRUFBRSxjQUFJLEVBQUUsa0JBQU0sRUFBRSxzQkFBdUIsQ0FBQztRQUN4RixJQUFNLFdBQVcsR0FBUTtZQUNyQixJQUFJLEVBQUUsSUFBSSxJQUFJLEdBQUc7WUFDakIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVztZQUN6QixLQUFLLE9BQUE7U0FDUixDQUFDO1FBQ0YsSUFBSSxDQUFDLENBQUMsU0FBUyxJQUFJLFFBQVEsRUFBRTtZQUN6QixXQUFXLENBQUMsU0FBUyxHQUFHLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzdFO1FBQ0QsSUFBSSxNQUFNLEVBQUU7WUFDUixXQUFXLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUMvQjtRQUNELElBQUksS0FBSyxJQUFJLFFBQVEsRUFBRTtZQUNuQixXQUFXLENBQUMsS0FBSyx5Q0FDVixLQUFLLEdBQ0wsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDakQsQ0FBQztTQUNMO1FBQ0QsT0FBTyxDQUNILDhDQUFPLFdBQVc7WUFDYiw2QkFBZ0IsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQzdCLFFBQVEsQ0FDVCxDQUNQLENBQUM7SUFDTixDQUFDO0lBQ0wsYUFBQztBQUFELENBQUMsQUFqRkQsQ0FBNEIsS0FBSyxDQUFDLGFBQWEsR0FpRjlDO0FBakZZLHdCQUFNIn0=