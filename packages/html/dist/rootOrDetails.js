"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var uuid_1 = require("uuid");
var moxb_1 = require("@moxb/moxb");
var mobx_react_1 = require("mobx-react");
var rendering_1 = require("./rendering");
function rootOrDetails(ownProps) {
    var nodeId = uuid_1.v4();
    return mobx_react_1.inject('locationManager')(mobx_react_1.observer(function (props) {
        var navControl = props.navControl;
        // console.log('root-or-details navControl is', navControl);
        var rootHooks = new moxb_1.HookMap();
        var detailHooks = new moxb_1.HookMap();
        var isRootActive = function () { return navControl.isActive() && moxb_1.isTokenEmpty(moxb_1.getNextPathToken(props)); };
        var isDetailActive = function () { return navControl.isActive() && !isRootActive(); };
        /**
         * We register ourselves as a change interceptor,
         * because we might have to hide some content
         * on location changes, and we want to know about that
         * in advance, so that we can suggest some questions to ask
         * from the user.
         */
        props.locationManager.registerChangeInterceptor({
            getId: function () {
                return nodeId;
            },
            /**
             * This is our "change interceptor" hook, that will be called by the
             * `LocationManager`.
             */
            // tslint:disable-next-line:cyclomatic-complexity
            anyQuestionsFor: function (location) {
                var oldToken = moxb_1.getNextPathToken(props);
                var oldRoot = moxb_1.isTokenEmpty(oldToken);
                var newToken = location.pathTokens[props.parsedTokens];
                var newRoot = moxb_1.isTokenEmpty(newToken);
                if (newRoot) {
                    if (oldRoot) {
                        // Staying at root, nothing to do.
                    }
                    else {
                        // Going from detail to root.
                        // We would hide the detail, so check with it.
                        return detailHooks
                            .getAll()
                            .map(function (h) { return (h.getLeaveQuestion ? h.getLeaveQuestion() : undefined); })
                            .filter(function (q) { return !!q; });
                    }
                }
                else {
                    if (oldRoot) {
                        // Going from root to detail.
                        // We would hide the root, so check with it.
                        return rootHooks
                            .getAll()
                            .map(function (h) { return (h.getLeaveQuestion ? h.getLeaveQuestion() : undefined); })
                            .filter(function (q) { return !!q; });
                    }
                    else {
                        // Staying ad detail, nothing to do
                    }
                }
                return [];
            },
        });
        var ifRoot = ownProps.ifRoot, ifDetails = ownProps.ifDetails;
        var token = moxb_1.getNextPathToken(props);
        if (moxb_1.isTokenEmpty(token)) {
            return rendering_1.renderSubStateCore({
                state: ifRoot,
                navigationContext: props,
                checkCondition: true,
                navControl: {
                    getParentName: function () { return 'rootOrDetail:root'; },
                    getAncestorNames: function () { return tslib_1.__spreadArrays(navControl.getAncestorNames(), ['rootOrDetail:root']); },
                    isActive: isRootActive,
                    registerStateHooks: rootHooks.set,
                    unregisterStateHooks: rootHooks.reset,
                },
            });
        }
        else {
            var detailProps = {
                token: token,
            };
            return rendering_1.renderSubStateCore({
                state: ifDetails,
                navigationContext: props,
                tokenIncrease: 1,
                extraProps: detailProps,
                checkCondition: true,
                navControl: {
                    getParentName: function () { return 'rootOrDetail:detail'; },
                    getAncestorNames: function () { return tslib_1.__spreadArrays(navControl.getAncestorNames(), ['rootOrDetail:detail']); },
                    isActive: isDetailActive,
                    registerStateHooks: detailHooks.set,
                    unregisterStateHooks: detailHooks.reset,
                },
            });
        }
    }));
}
exports.rootOrDetails = rootOrDetails;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vdE9yRGV0YWlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yb290T3JEZXRhaWxzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBb0M7QUFDcEMsbUNBUW9CO0FBQ3BCLHlDQUE4QztBQUM5Qyx5Q0FBaUQ7QUFpQmpELFNBQWdCLGFBQWEsQ0FBVyxRQUE0QjtJQUNoRSxJQUFNLE1BQU0sR0FBRyxTQUFNLEVBQUUsQ0FBQztJQUN4QixPQUFPLG1CQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FDNUIscUJBQVEsQ0FBQyxVQUFDLEtBQStCO1FBQzdCLElBQUEsNkJBQVUsQ0FBVztRQUM3Qiw0REFBNEQ7UUFDNUQsSUFBTSxTQUFTLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUNoQyxJQUFNLFdBQVcsR0FBRyxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQ2xDLElBQU0sWUFBWSxHQUFHLGNBQU0sT0FBQSxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksbUJBQVksQ0FBQyx1QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUE5RCxDQUE4RCxDQUFDO1FBQzFGLElBQU0sY0FBYyxHQUFHLGNBQU0sT0FBQSxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBeEMsQ0FBd0MsQ0FBQztRQUV0RTs7Ozs7O1dBTUc7UUFDSCxLQUFLLENBQUMsZUFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQztZQUM3QyxLQUFLO2dCQUNELE9BQU8sTUFBTSxDQUFDO1lBQ2xCLENBQUM7WUFFRDs7O2VBR0c7WUFDSCxpREFBaUQ7WUFDakQsZUFBZSxFQUFmLFVBQWdCLFFBQXNCO2dCQUNsQyxJQUFNLFFBQVEsR0FBRyx1QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekMsSUFBTSxPQUFPLEdBQUcsbUJBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFdkMsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FB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