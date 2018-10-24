import { SubState } from "./StateSpace";
import { LocationManager } from "./LocationManager";
import { StateSpaceAndLocationHandler, StateSpaceAndLocationHandlerProps } from "./StateSpaceAndLocationHandler";
import { StateSpaceHandlerImpl } from "./StateSpaceHandlerImpl";
import { UrlArg } from "./UrlArg";

export class StateSpaceAndLocationHandlerImpl extends StateSpaceHandlerImpl implements StateSpaceAndLocationHandler {

    private readonly _locationManager: LocationManager;
    private readonly _urlArg?: UrlArg<string>;
    private readonly _parsedTokens: number;

    public constructor(props: StateSpaceAndLocationHandlerProps) {
        super(props);
        const { locationManager, parsedTokens, arg } = props;
        this._locationManager = locationManager;
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
                return this._locationManager.doesPathTokenMatch(
                    (root ? '' : key!),
                    this._parsedTokens,
                    !!root,
                );
            }
        } else {
            return false;
        }
    }

    public getActiveSubStates(): SubState[] {
        return this._substates
            .filter(this.isSubStateActive);
    }

    public getActiveSubStateKeys(): string[] {
        return this.getActiveSubStates()
            .map(state => state.root ? "_root_" : state.key!);
    }

    public selectSubState(state: SubState) {
        if (this.isSubStateActive(state)) {
//            console.log("Not jumping, already in state", state);
        } else {
            if (this._urlArg) {
                this._urlArg.value = state.key!;
            } else {
//                console.log("Should change token #", this._parsedTokens, "to", state)
                this._locationManager.pushPathToken(this._parsedTokens, state.root ? null : state.key!);
            }
        }
    }

    public selectKey(key: string) {
        this.selectSubState(this.findSubState([key]));
    }

}
