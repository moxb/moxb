/**
 * A Navigable is a component that takes part in the navigation tree.
 *
 * When we render it, if it is an active component, it needs to know
 * where it stands in the tree.
 */
import { UsesLocation } from './location-manager';
import { StateCondition } from './location-state-space/state-space/StateSpace';

export interface Navigable<WidgetType, DataType> {
    /**
     * The number of tokens that have already been parsed, is any.
     *
     * (The selection should be determined by the first un-parsed token.)
     */
    parsedTokens?: number;

    filterCondition?: StateCondition<DataType>;
    fallback?: WidgetType;
    part?: string;
}

/**
 * Extract the next path token from the location manager, based on the number of parsed tokens passed down
 */
export function getNextPathToken<WidgetType, DataType>(props: Navigable<WidgetType, DataType> & UsesLocation): string {
    const { locationManager, parsedTokens } = props;
    return locationManager!.pathTokens[parsedTokens!];
}

/**
 * Extract the already parsed path tokens from the location manager, based on the number of parsed tokens passed down
 */
export function getParsedPathTokens<WidgetType, DataType>(props: Navigable<WidgetType, DataType> & UsesLocation) {
    const { locationManager, parsedTokens } = props;
    return locationManager!.pathTokens.slice(0, parsedTokens!);
}
