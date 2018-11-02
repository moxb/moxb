import { UIFragment } from '../UIFragment';
import { getUIFragment, UIFragmentSpec } from '../UIFragmentSpec';

describe('The getUIFragment function', () => {
    /**
     * The getUIFragment function can extract
     */

    const simpleFragment: UIFragment = 'simple fragment';
    const simpleFooterFragment: UIFragment = 'simple footer fragment';
    const simpleSpec: UIFragmentSpec = simpleFragment;

    const simpleFallbackFragment: UIFragment = 'simple fallback fragment';
    const simpleFallbackFooterFragment: UIFragment = 'simple fallback footer fragment';
    const simpleFallbackSpec: UIFragmentSpec = simpleFallbackFragment;

    const mapSpec: UIFragmentSpec = {
        main: simpleFragment,
        footer: simpleFooterFragment,
    };

    const partialMapSpec: UIFragmentSpec = {
        main: simpleFragment,
    };

    const mapFallbackSpec: UIFragmentSpec = {
        main: simpleFallbackFragment,
        footer: simpleFallbackFooterFragment,
    };

    it('can return a simple fragment, when there is no map involved', () => {
        expect(getUIFragment(simpleSpec, simpleFallbackSpec, null, false)).toBe(simpleFragment);
    });

    it('can return a simple fall-back fragment, when there is no map involved, and spec is missing', () => {
        expect(getUIFragment(null, simpleFallbackSpec, undefined, false)).toBe(simpleFallbackFragment);
    });

    it('can return a simple fragment, with no map, when main is requested', () => {
        expect(getUIFragment(simpleSpec, simpleFallbackSpec, 'main', false)).toBe(simpleFragment);
    });

    it('can return a simple fallback fragment, with no map, when main is requested', () => {
        expect(getUIFragment(null, simpleFallbackSpec, 'main', false)).toBe(simpleFallbackFragment);
    });

    it('can return a simple fragment based on a map', () => {
        expect(getUIFragment(mapSpec, mapFallbackSpec, 'main', false)).toBe(simpleFragment);
    });

    it('can return another simple fragment based on a map', () => {
        expect(getUIFragment(mapSpec, mapFallbackSpec, 'footer', false)).toBe(simpleFooterFragment);
    });

    it('can return the relevant part from the fallback, if the wanted part is missing', () => {
        expect(getUIFragment(partialMapSpec, mapFallbackSpec, 'footer', false)).toBe(simpleFallbackFooterFragment);
    });
});
