import { LocationManager, UpdateMethod } from './LocationManager';
import { StateSpaceAndLocationHandler, StateSpaceAndLocationHandlerProps } from './StateSpaceAndLocationHandler';
import { StateSpaceHandlerImpl } from './StateSpaceHandlerImpl';
import { UrlArg } from './UrlArg';
import { SubStateInContext } from './StateSpace';

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

    public isSubStateActive(state: SubStateInContext) {
        const { parentPathTokens, root, key } = state;
        if (root || key) {
            if (this._urlArg) {
                return this._urlArg.value === key;
            } else {
                const mustBeExact: boolean = !!root; // No, this can't be simplified.
                const tokens = [...parentPathTokens, root ? '' : key!];
                const result = this._locationManager.doPathTokensMatch(tokens, this._parsedTokens, mustBeExact);
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
            }
        } else {
            return false;
        }
    }

    public getActiveSubStates(): SubStateInContext[] {
        return this._allSubStates.filter(this.isSubStateActive);
    }

    public getActiveSubStateMenuKeys(): string[] {
        return this.getActiveSubStates().map(state => state.menuKey);
    }

    public selectSubState(state: SubStateInContext, method?: UpdateMethod) {
        if (this.isSubStateActive(state)) {
            //            console.log("Not jumping, already in state", state);
        } else {
            const { root, parentPathTokens, key } = state;
            if (this._urlArg) {
                this._urlArg.value = key!;
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
}
