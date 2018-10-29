import { SubState } from './StateSpace';
import { LocationManager, UpdateMethod } from './LocationManager';
import { StateSpaceAndLocationHandler, StateSpaceAndLocationHandlerProps } from './StateSpaceAndLocationHandler';
import { StateSpaceHandlerImpl } from './StateSpaceHandlerImpl';
import { UrlArg } from './UrlArg';

export class StateSpaceAndLocationHandlerImpl extends StateSpaceHandlerImpl implements StateSpaceAndLocationHandler {
    private readonly _locationManager: LocationManager;
    private readonly _urlArg?: UrlArg<string>;
    private readonly _parsedTokens: number;

    public constructor(props: StateSpaceAndLocationHandlerProps) {
        super(props);
        const { locationManager, parsedTokens, arg } = props;
        this._locationManager = locationManager!;
        this._urlArg = arg;
        this._parsedTokens = parsedTokens || 0;
        this.isSubStateActive = this.isSubStateActive.bind(this);
    }

    public isSubStateActive(state: SubState) {
        const { root, key } = state;
        if (root || key) {
            if (this._urlArg) {
                return this._urlArg.value === key;
            } else {
                const mustBeExact: boolean = !!root; // No, this can't be simplified.
                return this._locationManager.doesPathTokenMatch(root ? '' : key!, this._parsedTokens, mustBeExact);
            }
        } else {
            return false;
        }
    }

    public getActiveSubStates(): SubState[] {
        return this._subStates.filter(this.isSubStateActive);
    }

    public getActiveSubStateKeys(): string[] {
        return this.getActiveSubStates().map(state => (state.root ? '_root_' : state.key!));
    }

    public selectSubState(state: SubState, method?: UpdateMethod) {
        if (this.isSubStateActive(state)) {
            //            console.log("Not jumping, already in state", state);
        } else {
            if (this._urlArg) {
                this._urlArg.value = state.key!;
            } else {
                //                console.log("Should change token #", this._parsedTokens, "to", state)
                this._locationManager.setPathTokens(this._parsedTokens, state.root ? [] : [state.key!], method);
            }
        }
    }

    public selectKey(key: string) {
        const subState = this.findSubState([key]);
        if (subState) {
            this.selectSubState(subState);
        } else {
            throw new Error("Couldn't find sub-state with key '" + key + "'.");
        }
    }
}
