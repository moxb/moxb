import { SubState } from './StateSpace';
import { LocationManager, UpdateMethod } from './LocationManager';
import {
    StateSpaceAndLocationHandler,
    StateSpaceAndLocationHandlerProps,
    SubStateSpecification,
} from './StateSpaceAndLocationHandler';
import { StateSpaceHandlerImpl } from './StateSpaceHandlerImpl';
import { UrlArg } from './UrlArg';
import { SubStateKeyGenerator } from './SubStateKeyGenerator';
import { SubStateKeyGeneratorImpl } from './SubStateKeyGeneratorImpl';

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
    protected readonly _keyGen: SubStateKeyGenerator;
    protected readonly _subStateSpecs: SubStateSpecification[];

    protected _enumerateSubStateSpecs(parentPathTokens: string[], subState: SubState): SubStateSpecification[] {
        const me: SubStateSpecification = {
            parentPathTokens,
            subState,
            key: this._keyGen.getKey(parentPathTokens, subState),
        };
        const mine: SubStateSpecification[][] = subState.subStates
            ? subState.subStates.map(s => this._enumerateSubStateSpecs([...parentPathTokens, subState.key!], s))
            : [];
        return [me, ...Array.prototype.concat(...mine)];
    }

    public constructor(props: StateSpaceAndLocationHandlerProps) {
        super(props);
        const { locationManager, parsedTokens, arg, id } = props;
        this._id = id || 'no-id';
        this._locationManager = locationManager!;
        this._urlArg = arg;
        this._parsedTokens = parsedTokens || 0;
        this._keyGen = props.keyGen || new SubStateKeyGeneratorImpl();
        this._enumerateSubStateSpecs = this._enumerateSubStateSpecs.bind(this);
        this.isSubStateActive = this.isSubStateActive.bind(this);
        this._subStateSpecs = Array.prototype.concat(...this._subStates.map(s => this._enumerateSubStateSpecs([], s)));
    }

    public isSubStateActive(spec: SubStateSpecification) {
        const { parentPathTokens, subState } = spec;
        const { root, key } = subState;
        if (root || key) {
            if (this._urlArg) {
                return this._urlArg.value === key;
            } else {
                const mustBeExact: boolean = !!root; // No, this can't be simplified.
                const result = this._locationManager.doPathTokensMatch(
                    [...parentPathTokens, root ? '' : key!],
                    this._parsedTokens,
                    mustBeExact
                );
                return result;
            }
        } else {
            return false;
        }
    }

    public getActiveSubStates(): SubStateSpecification[] {
        return this._subStateSpecs.filter(this.isSubStateActive);
    }

    public getActiveSubStateKeys(): string[] {
        return this.getActiveSubStates().map(spec => this._keyGen.getKey(spec.parentPathTokens, spec.subState));
    }

    public selectSubState(state: SubState, method?: UpdateMethod) {
        if (
            this.isSubStateActive({
                parentPathTokens: [],
                subState: state,
                key: this._keyGen.getKey([], state),
            })
        ) {
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
