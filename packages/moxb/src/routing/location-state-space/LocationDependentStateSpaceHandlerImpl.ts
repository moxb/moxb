import { LocationManager, UpdateMethod } from '../location-manager/LocationManager';
import {
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerProps,
} from './LocationDependentStateSpaceHandler';
import { StateSpaceHandlerImpl } from './state-space/StateSpaceHandlerImpl';
import { UrlArg, UrlArgImpl, URLARG_TYPE_ORDERED_STRING_ARRAY } from '../url-arg';
import { SubStateInContext } from './state-space/StateSpace';
import { doTokenStringsMatch, updateTokenString } from '../tokens';

/**
 * This is the standard implementation of the StateSpaceAndLocationHandler.
 *
 * See the StateSpaceAndLocationHandler interface for more details.
 */
export class LocationDependentStateSpaceHandlerImpl<LabelType, WidgetType, DataType>
    extends StateSpaceHandlerImpl<LabelType, WidgetType, DataType>
    implements LocationDependentStateSpaceHandler<LabelType, WidgetType, DataType> {
    protected readonly _locationManager: LocationManager;
    protected readonly _urlArg?: UrlArg<string[]>;
    protected readonly _parsedTokens: number;

    public constructor(props: LocationDependentStateSpaceHandlerProps<LabelType, WidgetType, DataType>) {
        super(props);
        const { locationManager, parsedTokens, arg } = props;
        this._locationManager = locationManager!;
        this._urlArg = arg
            ? new UrlArgImpl(locationManager!, {
                  key: arg.key,
                  valueType: URLARG_TYPE_ORDERED_STRING_ARRAY,
                  defaultValue:
                      typeof arg.defaultValue === 'object'
                          ? arg.defaultValue
                          : URLARG_TYPE_ORDERED_STRING_ARRAY.getParser(arg.key)(arg.defaultValue, []),
              })
            : undefined;
        this._parsedTokens = parsedTokens || 0;
        if (this._debug) {
            console.log('Parsed tokens for state-space-and-location-handler', this._id, ':', this._parsedTokens);
        }
        this.isSubStateActive = this.isSubStateActive.bind(this);
    }

    /**
     * Does the given sub-state (group) has any active sub-states?
     */
    protected _hasActiveSubState(state: SubStateInContext<LabelType, WidgetType, DataType>): boolean {
        const { subStates, isGroupOnly, flat } = state;
        if (!isGroupOnly || !flat) {
            throw new Error('This method is only for flat groups');
        }
        let result = false;
        subStates!.forEach(subState => {
            if (this.isSubStateActive(subState)) {
                result = true;
            }
        });
        return result;
    }

    /**
     * Is the give sub-state currently active?
     */
    public isSubStateActive(state: SubStateInContext<LabelType, WidgetType, DataType>) {
        const { parentPathTokens, root, key, isGroupOnly, flat } = state;
        if (root || key) {
            const currentTokens = this._urlArg ? this._urlArg.value : this._locationManager.pathTokens;
            const mustBeExact: boolean = !!root; // No, this can't be simplified.
            const tokens = [...parentPathTokens, root ? '' : key!];
            if (isGroupOnly && flat) {
                return this._hasActiveSubState(state);
            }
            const result = doTokenStringsMatch(
                currentTokens,
                tokens,
                this._urlArg ? 0 : this._parsedTokens,
                mustBeExact,
                this._debug
            );
            return result;
        } else {
            return false;
        }
    }

    /**
     * Return a list of currently active sub-states
     * @param leavesOnly Should we skip groups?
     */
    public getActiveSubStates(leavesOnly: boolean): SubStateInContext<LabelType, WidgetType, DataType>[] {
        const states = leavesOnly ? this._allSubStates.filter(s => !s.isGroupOnly) : this._allSubStates;
        return states.filter(this.isSubStateActive);
    }

    /**
     * Return the single active sub-state leaf, if any
     */
    public getActiveSubState(): SubStateInContext<LabelType, WidgetType, DataType> | null {
        const results = this.getActiveSubStates(true);
        if (results.length > 1) {
            throw new Error('Uh-oh. More than one active state found');
        }
        return results[0] || null;
    }

    /**
     * Return the list of menu-keys of the currently active sub-states
     * @param leavesOnly Should we skip groups?
     */
    public getActiveSubStateMenuKeys(leavesOnly: boolean): string[] {
        return this.getActiveSubStates(leavesOnly).map(state => state.menuKey);
    }

    /**
     * Calculate what would be the string value of the the argument if we select a given sub-state
     *
     * @param state The sub-state to select
     */
    protected _getArgValueForSubState(state: SubStateInContext<LabelType, WidgetType, DataType>): string[] {
        const currentTokens = this._urlArg!.value;
        const newTokens = updateTokenString(currentTokens, 0, state.totalPathTokens);
        return newTokens;
    }

    /**
     * Return the URL that would select a given sub-state
     */
    public getUrlForSubState(state: SubStateInContext<LabelType, WidgetType, DataType>): string {
        if (this._urlArg) {
            const value = this._getArgValueForSubState(state);
            return this._urlArg.getModifiedUrl(value);
        } else {
            return this._locationManager.getURLForPathTokens(this._parsedTokens, state.totalPathTokens);
        }
    }

    /**
     * Select the given sub-state
     *
     * @param state The sub-state to select
     * @param method The method for updating the URL
     */
    public selectSubState(state: SubStateInContext<LabelType, WidgetType, DataType>, method?: UpdateMethod) {
        if (this.isSubStateActive(state)) {
            //            console.log("Not jumping, already in state", state);
        } else {
            const { root, parentPathTokens, key } = state;
            if (this._urlArg) {
                const value = this._getArgValueForSubState(state);
                this._urlArg.value = value;
            } else {
                //                console.log("Should change token #", this._parsedTokens, "to", state)
                this._locationManager.setPathTokens(
                    this._parsedTokens,
                    root ? parentPathTokens : [...parentPathTokens, key!],
                    method
                );
            }
        }
    }

    /**
     * Select the sub-state addressed by the given string of tokens
     */
    public selectByTokens(tokens: string[]) {
        const subState = this.findSubState(tokens);
        if (subState) {
            this.selectSubState(subState);
        } else {
            throw new Error("Couldn't find sub-state with tokens [" + tokens.join(', ') + '].');
        }
    }
}
