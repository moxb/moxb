/**
 * An UIFragmentMap is simply a map of UI fragments.
 */
import { UIFragment } from './UIFragment';
import { isForwardRef } from './isForwardRef';

/**
 * An UIFragmentMap is a map of UIFragments.
 *
 * The use case is that sometimes we want to specify the UI in multiple parts, which can then be inserted
 * to the page at multiple locations. (Like in slots.)
 */
interface UIFragmentMap {
    [id: string]: UIFragment | undefined;
}

/**
 * An UIFragmentSpec is either a simple UIFragment, or a map of UIFragments.
 *
 * It can be used in situations when we either expect a simple fragment,
 * or potentially a map of fragments.
 */
export type UIFragmentSpec = UIFragment | UIFragmentMap;

/**
 * Determine whether an UIFragmentSpec value is actually a map
 */
const isUIFragmentMap = (spec: any): spec is UIFragmentMap => {
    if (!spec || typeof spec !== 'object') {
        return false;
    }
    if (spec.main) {
        return true;
    }
    // handle forward refs
    if (isForwardRef(spec)) {
        return false;
    }
    return !spec.props;
};

/**
 * Convert an UIFragmentSpec to the map format, if it's not already a map
 */
const getUIFragmentMap = (spec: UIFragmentSpec): UIFragmentMap => {
    if (isUIFragmentMap(spec)) {
        return spec;
    } else {
        return { main: spec };
    }
};

/**
 * Look up a specific key from an UIFragmentSpec
 */
const extractPartFromUIFragmentSpec = (
    spec: UIFragmentSpec,
    part: string | null | undefined,
    debugMode?: boolean
): UIFragment | null => {
    const map = getUIFragmentMap(spec);
    const wanted = part || 'main';
    const result = (map as any)[wanted] || null;
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
export const extractUIFragmentFromSpec = (
    spec: UIFragmentSpec | null | undefined,
    fallback: UIFragmentSpec | null | undefined,
    wantedPart: string | null | undefined,
    debugMode?: boolean
): UIFragment => {
    const part = wantedPart || 'main';
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
    let specWithFallback: UIFragmentSpec;
    // if (part) {
    if (debugMode) {
        console.log('Looking for a specific part, creating object for parts...');
    }
    // We create a map which merges the fallback values with those that have actually been given.
    specWithFallback = {
        ...getUIFragmentMap(fallback ? fallback : {}),
        ...getUIFragmentMap(spec ? spec : {}),
    };
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
    const fragment = extractPartFromUIFragmentSpec(specWithFallback, part, debugMode);
    // if (debugMode) {
    //     console.log('Returning fragment', fragment);
    // }
    return fragment || 'no content';
};
