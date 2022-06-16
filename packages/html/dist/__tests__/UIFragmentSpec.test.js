"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UIFragmentSpec_1 = require("../UIFragmentSpec");
describe('The getUIFragment function', function () {
    /**
     * The getUIFragment function can extract
     */
    var simpleFragment = 'simple fragment';
    var simpleFooterFragment = 'simple footer fragment';
    var simpleSpec = simpleFragment;
    var simpleFallbackFragment = 'simple fallback fragment';
    var simpleFallbackFooterFragment = 'simple fallback footer fragment';
    var simpleFallbackSpec = simpleFallbackFragment;
    var mapSpec = {
        main: simpleFragment,
        footer: simpleFooterFragment,
    };
    var partialMapSpec = {
        main: simpleFragment,
    };
    var mapFallbackSpec = {
        main: simpleFallbackFragment,
        footer: simpleFallbackFooterFragment,
    };
    it('can return a simple fragment, when there is no map involved', function () {
        expect(UIFragmentSpec_1.extractUIFragmentFromSpec(simpleSpec, simpleFallbackSpec, null, false)).toBe(simpleFragment);
    });
    it('can return a simple fall-back fragment, when there is no map involved, and spec is missing', function () {
        expect(UIFragmentSpec_1.extractUIFragmentFromSpec(undefined, simpleFallbackSpec, undefined, false)).toBe(simpleFallbackFragment);
    });
    it('can return a simple fragment, with no map, when main is requested', function () {
        expect(UIFragmentSpec_1.extractUIFragmentFromSpec(simpleSpec, simpleFallbackSpec, 'main', false)).toBe(simpleFragment);
    });
    it('can return a simple fallback fragment, with no map, when main is requested', function () {
        expect(UIFragmentSpec_1.extractUIFragmentFromSpec(undefined, simpleFallbackSpec, 'main', false)).toBe(simpleFallbackFragment);
    });
    it('can return a simple fragment based on a map', function () {
        expect(UIFragmentSpec_1.extractUIFragmentFromSpec(mapSpec, mapFallbackSpec, 'main', false)).toBe(simpleFragment);
    });
    it('can return another simple fragment based on a map', function () {
        expect(UIFragmentSpec_1.extractUIFragmentFromSpec(mapSpec, mapFallbackSpec, 'footer', false)).toBe(simpleFooterFragment);
    });
    it('can return the relevant part from the fallback, if the wanted part is missing', function () {
        expect(UIFragmentSpec_1.extractUIFragmentFromSpec(partialMapSpec, mapFallbackSpec, 'footer', false)).toBe(simpleFallbackFooterFragment);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlGcmFnbWVudFNwZWMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vVUlGcmFnbWVudFNwZWMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG9EQUE4RTtBQUU5RSxRQUFRLENBQUMsNEJBQTRCLEVBQUU7SUFDbkM7O09BRUc7SUFFSCxJQUFNLGNBQWMsR0FBZSxpQkFBaUIsQ0FBQztJQUNyRCxJQUFNLG9CQUFvQixHQUFlLHdCQUF3QixDQUFDO0lBQ2xFLElBQU0sVUFBVSxHQUFtQixjQUFjLENBQUM7SUFFbEQsSUFBTSxzQkFBc0IsR0FBZSwwQkFBMEIsQ0FBQztJQUN0RSxJQUFNLDRCQUE0QixHQUFlLGlDQUFpQyxDQUFDO0lBQ25GLElBQU0sa0JBQWtCLEdBQW1CLHNCQUFzQixDQUFDO0lBRWxFLElBQU0sT0FBTyxHQUFtQjtRQUM1QixJQUFJLEVBQUUsY0FBYztRQUNwQixNQUFNLEVBQUUsb0JBQW9CO0tBQy9CLENBQUM7SUFFRixJQUFNLGNBQWMsR0FBbUI7UUFDbkMsSUFBSSxFQUFFLGNBQWM7S0FDdkIsQ0FBQztJQUVGLElBQU0sZUFBZSxHQUFtQjtRQUNwQyxJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLE1BQU0sRUFBRSw0QkFBNEI7S0FDdkMsQ0FBQztJQUVGLEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtRQUM5RCxNQUFNLENBQUMsMENBQXlCLENBQUMsVUFBVSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN4RyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0RkFBNEYsRUFBRTtRQUM3RixNQUFNLENBQUMsMENBQXlCLENBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3BILENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1FQUFtRSxFQUFFO1FBQ3BFLE1BQU0sQ0FBQywwQ0FBeUIsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzFHLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRFQUE0RSxFQUFFO1FBQzdFLE1BQU0sQ0FBQywwQ0FBeUIsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDakgsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUU7UUFDOUMsTUFBTSxDQUFDLDBDQUF5QixDQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3BHLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1EQUFtRCxFQUFFO1FBQ3BELE1BQU0sQ0FBQywwQ0FBeUIsQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQzVHLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtFQUErRSxFQUFFO1FBQ2hGLE1BQU0sQ0FBQywwQ0FBeUIsQ0FBQyxjQUFjLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDcEYsNEJBQTRCLENBQy9CLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=