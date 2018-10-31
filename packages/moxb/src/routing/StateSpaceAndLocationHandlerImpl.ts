import { LocationManager, UpdateMethod } from './LocationManager';
import { StateSpaceAndLocationHandler, StateSpaceAndLocationHandlerProps } from './StateSpaceAndLocationHandler';
import { StateSpaceHandlerImpl } from './StateSpaceHandlerImpl';
import { UrlArg } from './UrlArg';
import { SubStateInContext } from './StateSpace';
import { doTokenStringsMatch, joinTokenString, updateTokenString } from './token';

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

    public isSubStateActive(state: SubStateInContext) {
        const { parentPathTokens, root, key, isGroupOnly, hierarchical } = state;
        if (root || key) {
            const currentTokens = this._urlArg ? this._urlArg.value.split('.') : this._locationManager.pathTokens;
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
            // if (this._id === 'left-menu' && key === 'one') {
            //     console.log(
            //         'is subState',
            //         state.menuKey,
            //         'active?',
            //         result,
            //         'checked tokens',
            //         tokens,
            //         '(already parsed:',
            //         this._parsedTokens,
            //         ')',
            //         'exactOnly?',
            //         mustBeExact
            //     );
            // }
            return result;
        } else {
            return false;
        }
    }

    public getActiveSubStates(leavesOnly: boolean): SubStateInContext[] {
        const states = leavesOnly ? this._allSubStates.filter(s => !s.isGroupOnly) : this._allSubStates;
        return states.filter(this.isSubStateActive);
    }

    public getActiveSubStateMenuKeys(leavesOnly: boolean): string[] {
        return this.getActiveSubStates(leavesOnly).map(state => state.menuKey);
    }

    protected _getArgValueForSubState(state: SubStateInContext): string {
        const currentTokens = this._urlArg!.value.split('.');
        const newTokens = updateTokenString(currentTokens, 0, state.totalPathTokens);
        const value = joinTokenString(newTokens);
        return value;
    }

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

    public selectByTokens(tokens: string[]) {
        const subState = this.findSubState(tokens);
        if (subState) {
            this.selectSubState(subState);
        } else {
            throw new Error("Couldn't find sub-state with tokens [" + tokens.join(', ') + '].');
        }
    }

    public getUrlForSubState(state: SubStateInContext): string {
        if (this._urlArg) {
            const value = this._getArgValueForSubState(state);
            return this._urlArg.getModifiedUrl(value);
        } else {
            return this._locationManager.getURLForPathTokens(this._parsedTokens, state.totalPathTokens);
        }
    }
}
