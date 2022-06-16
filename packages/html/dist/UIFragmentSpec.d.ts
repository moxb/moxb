/// <reference types="react" />
/**
 * An UIFragmentMap is simply a map of UI fragments.
 */
import { UIFragment } from './UIFragment';
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
export declare type UIFragmentSpec = UIFragment | UIFragmentMap;
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
export declare const extractUIFragmentFromSpec: (spec: string | JSX.Element | ((props: any) => JSX.Element | null) | import("react").ComponentClass<any, any> | UIFragmentMap | null | undefined, fallback: string | JSX.Element | ((props: any) => JSX.Element | null) | import("react").ComponentClass<any, any> | UIFragmentMap | null | undefined, wantedPart: string | null | undefined, debugMode?: boolean | undefined) => UIFragment;
export {};
