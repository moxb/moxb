"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var isForwardRef_1 = require("./isForwardRef");
/**
 * Determine whether an UIFragmentSpec value is actually a map
 */
var isUIFragmentMap = function (spec) {
    if (!spec || typeof spec !== 'object') {
        return false;
    }
    if (spec.main) {
        return true;
    }
    // handle forward refs
    if (isForwardRef_1.isForwardRef(spec)) {
        return false;
    }
    if (spec.$$typeof) {
        return false;
    }
    return !spec.props;
};
/**
 * Convert an UIFragmentSpec to the map format, if it's not already a map
 */
var getUIFragmentMap = function (spec) {
    if (isUIFragmentMap(spec)) {
        // Do we already have a map?
        return spec;
    }
    else {
        return { main: spec };
    }
};
/**
 * Look up a specific key from an UIFragmentSpec
 */
var extractPartFromUIFragmentSpec = function (spec, part, debugMode) {
    var map = getUIFragmentMap(spec);
    var wanted = part || 'main';
    var result = map[wanted] || null;
    if (!!debugMode) {
        console.log('Map is', map);
        console.log('Wanted part is', part);
        console.log('Result is', result);
    }
    return result;
};
/**
 * Extract a given fragment from a spec, considering the requested part and a fallback spec
 *
 * @param spec The spec too look at.
 * Can be either a fragment map or a simple fragment. If it's a simple fragment, it's assumed to mean the "main" part.
 *
 * @param fallback The fragment to look at when there is no spec, or the spec is partial only.
 * Can be either a fragment map or a simple fragment. If it's a simple fragment, it's assumed to mean the "main" part.
 *
 * @param wantedPart The part to look at, if any. Defaults to "main".
 *
 * @param debugMode Should we output debug log?
 */
exports.extractUIFragmentFromSpec = function (spec, fallback, wantedPart, debugMode) {
    var part = wantedPart || 'main';
    // if (debugMode) {
    //     console.log(
    //         'spec is',
    //         '"' + spec + '"',
    //         typeof spec,
    //         'fallback is',
    //         '"' + fallback + '"',
    //         typeof fallback,
    //         'part is',
    //         '"' + part + '"',
    //         typeof part
    //     );
    // }
    var specWithFallback;
    // if (part) {
    if (debugMode) {
        console.log('Looking for a specific part, creating object for parts...');
    }
    // We create a map which merges the fallback values with those that have actually been given.
    specWithFallback = tslib_1.__assign(tslib_1.__assign({}, getUIFragmentMap(fallback ? fallback : {})), getUIFragmentMap(spec ? spec : {}));
    // } else {
    //     if (debugMode) {
    //         console.log('Not looking for a specific part, just using whole fragment map');
    //     }
    //     specWithFallback = spec ? spec : fallback;
    // }
    // if (debugMode) {
    //     console.log(
    //         'specWithFallback is',
    //         '"' + JSON.stringify(specWithFallback, null, '  ') + '"',
    //         typeof specWithFallback
    //     );
    // }
    var fragment = extractPartFromUIFragmentSpec(specWithFallback, part, debugMode);
    // if (debugMode) {
    //     console.log('Returning fragment', fragment);
    // }
    return fragment || 'no content';
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlGcmFnbWVudFNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVUlGcmFnbWVudFNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsK0NBQThDO0FBb0I5Qzs7R0FFRztBQUNILElBQU0sZUFBZSxHQUFHLFVBQUMsSUFBUztJQUM5QixJQUFJLENBQUMsSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNuQyxPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUNELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtRQUNYLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxzQkFBc0I7SUFDdEIsSUFBSSwyQkFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ2YsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN2QixDQUFDLENBQUM7QUFFRjs7R0FFRztBQUNILElBQU0sZ0JBQWdCLEdBQUcsVUFBQyxJQUFvQjtJQUMxQyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2Qiw0QkFBNEI7UUFDNUIsT0FBTyxJQUFxQixDQUFDO0tBQ2hDO1NBQU07UUFDSCxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQWtCLEVBQUUsQ0FBQztLQUN2QztBQUNMLENBQUMsQ0FBQztBQUVGOztHQUVHO0FBQ0gsSUFBTSw2QkFBNkIsR0FBRyxVQUNsQyxJQUFvQixFQUNwQixJQUErQixFQUMvQixTQUFtQjtJQUVuQixJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxJQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksTUFBTSxDQUFDO0lBQzlCLElBQU0sTUFBTSxHQUFJLEdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDNUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFO1FBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNwQztJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7R0FZRztBQUNVLFFBQUEseUJBQXlCLEdBQUcsVUFDckMsSUFBdUMsRUFDdkMsUUFBMkMsRUFDM0MsVUFBcUMsRUFDckMsU0FBbUI7SUFFbkIsSUFBTSxJQUFJLEdBQUcsVUFBVSxJQUFJLE1BQU0sQ0FBQztJQUNsQyxtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLHFCQUFxQjtJQUNyQiw0QkFBNEI7SUFDNUIsdUJBQXVCO0lBQ3ZCLHlCQUF5QjtJQUN6QixnQ0FBZ0M7SUFDaEMsMkJBQTJCO0lBQzNCLHFCQUFxQjtJQUNyQiw0QkFBNEI7SUFDNUIsc0JBQXNCO0lBQ3RCLFNBQVM7SUFDVCxJQUFJO0lBQ0osSUFBSSxnQkFBZ0MsQ0FBQztJQUNyQyxjQUFjO0lBQ2QsSUFBSSxTQUFTLEVBQUU7UUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7S0FDNUU7SUFDRCw2RkFBNkY7SUFDN0YsZ0JBQWdCLHlDQUNULGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FDMUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUN4QyxDQUFDO0lBQ0YsV0FBVztJQUNYLHVCQUF1QjtJQUN2Qix5RkFBeUY7SUFDekYsUUFBUTtJQUNSLGlEQUFpRDtJQUNqRCxJQUFJO0lBQ0osbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQixpQ0FBaUM7SUFDakMsb0VBQW9FO0lBQ3BFLGtDQUFrQztJQUNsQyxTQUFTO0lBQ1QsSUFBSTtJQUNKLElBQU0sUUFBUSxHQUFHLDZCQUE2QixDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNsRixtQkFBbUI7SUFDbkIsbURBQW1EO0lBQ25ELElBQUk7SUFDSixPQUFPLFFBQVEsSUFBSSxZQUFZLENBQUM7QUFDcEMsQ0FBQyxDQUFDIn0=