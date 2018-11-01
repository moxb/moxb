import { LocationManager, UpdateMethod } from './LocationManager';
import { StateSpaceAndLocationHandler, StateSpaceAndLocationHandlerProps } from './StateSpaceAndLocationHandler';
import { StateSpaceHandlerImpl } from './StateSpaceHandlerImpl';
import { UrlArg } from './UrlArg';
import { SubStateInContext } from './StateSpace';
import { doTokenStringsMatch, joinTokenString, splitTokenString, updateTokenString } from './tokens';

/**
 * This is the standard implementation of the StateSpaceAndLocationHandler.
 *
 * See the StateSpaceAndLocationHandler interface for more details.
 */
export class StateSpaceAndLocationHandlerImpl extends StateSpaceHandlerImpl implements StateSpaceAndLocationHandler {
    protected readonly _id: string;
    protected readonly _locationManager: LocationManager;
    protected readonly _urlArg?: UrlArg<string>;
    protected readonly _parsedTokens: number;

    public constructor(props: StateSpaceAndLocationHandlerProps) {
        super(props);
        const { locationManager, parsedTokens, arg, id } = props;
        this._id = id || 'no-id';
        this._locationManager = locationManager!;
        this._urlArg = arg;
        this._parsedTokens = parsedTokens || 0;

        this.isSubStateActive = this.isSubStateActive.bind(this);
    }

    /**
     * Does the given sub-state (group) has any active sub-states?
     */
    protected _hasActiveSubState(state: SubStateInContext): boolean {
        const { subStates, isGroupOnly, hierarchical } = state;
        if (!isGroupOnly || hierarchical) {
            throw new Error('This method is only for non-hierarchical groups');
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
    public isSubStateActive(state: SubStateInContext) {
        const { parentPathTokens, root, key, isGroupOnly, hierarchical } = state;
        if (root || key) {
            const currentTokens = this._urlArg
                ? splitTokenString(this._urlArg.value)
                : this._locationManager.pathTokens;
            const mustBeExact: boolean = !!root; // No, this can't be simplified.
            const tokens = [...parentPathTokens, root ? '' : key!];
            if (isGroupOnly && !hierarchical) {
                return this._hasActiveSubState(state);
            }
            const result = doTokenStringsMatch(
                currentTokens,
                tokens,
                this._urlArg ? 0 : this._parsedTokens,
                mustBeExact
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
    public getActiveSubStates(leavesOnly: boolean): SubStateInContext[] {
        const states = leavesOnly ? this._allSubStates.filter(s => !s.isGroupOnly) : this._allSubStates;
        return states.filter(this.isSubStateActive);
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
    protected _getArgValueForSubState(state: SubStateInContext): string {
        const currentTokens = splitTokenString(this._urlArg!.value);
        const newTokens = updateTokenString(currentTokens, 0, state.totalPathTokens);
        const value = joinTokenString(newTokens);
        return value;
    }

    /**
     * Return the URL that would select a given sub-state
     */
    public getUrlForSubState(state: SubStateInContext): string {
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
    public selectSubState(state: SubStateInContext, method?: UpdateMethod) {
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
