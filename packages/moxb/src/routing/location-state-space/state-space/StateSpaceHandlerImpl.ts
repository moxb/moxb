import { SubState, StateCondition, SubStateInContext } from './StateSpace';
import { StateSpaceHandler, StateSpaceHandlerProps } from './StateSpaceHandler';
import { SubStateKeyGenerator } from './SubStateKeyGenerator';
import { SubStateKeyGeneratorImpl } from './SubStateKeyGeneratorImpl';
import { doTokenStringsMatch, isTokenEmpty } from '../../tokens';

/**
 * Recursively filter out the sub-states that are hidden or don't match the filter
 *
 * @param states the SubStates to start with
 * @param filter the optional condition to use for filtering
 */
function filterSubStates(states: SubStateInContext[], filter?: StateCondition): SubStateInContext[] {
    return states.filter(state => !state.hidden && (!filter || filter(state))).map(state => {
        if (state.subStates) {
            return {
                ...state,
                subStates: filterSubStates(state.subStates, filter),
            };
        } else {
            return state;
        }
    });
}

/**
 * This is the standard implementation for StateSpaceHandler.
 *
 * See the StateSpaceHandler interface for more details.
 */
export class StateSpaceHandlerImpl implements StateSpaceHandler {
    protected readonly _id: string;
    protected readonly _debug?: boolean;
    protected readonly _keyGen: SubStateKeyGenerator;
    public readonly _subStatesInContext: SubStateInContext[];
    protected readonly _allSubStates: SubStateInContext[];
    protected readonly _filterCondition?: StateCondition;

    /**
     * Add context info around a given sub-state
     *
     * @param parentPathTokens the path tokens required to reach this the level where this sub-state is directly selectable
     * @param state The sub-state to work with
     */
    protected _addContext(parentPathTokens: string[], state: SubState): SubStateInContext {
        const { root, key, subStates, flat } = state;
        const newTokens = !!subStates ? (flat ? [] : [key!]) : root ? [] : [key!];
        const totalPathTokens: string[] = [...parentPathTokens, ...newTokens];
        return {
            ...state,
            parentPathTokens,
            totalPathTokens,
            isGroupOnly: !!subStates,
            subStates: subStates ? subStates.map(s => this._addContext(totalPathTokens, s)) : undefined,
            menuKey: this._keyGen.getKey(parentPathTokens, state),
        };
    }

    protected _enumerateSubStates(state: SubStateInContext): SubStateInContext[] {
        const subStates: SubStateInContext[] = state.subStates
            ? Array.prototype.concat(...state.subStates.map(s => this._enumerateSubStates(s)))
            : [];
        return [state, ...subStates];
    }

    public constructor(props: StateSpaceHandlerProps) {
        const { id, keyGen, subStates, filterCondition, debug } = props;
        this._id = id || 'no-id';
        this._debug = debug;
        this._keyGen = keyGen || new SubStateKeyGeneratorImpl();
        this._enumerateSubStates = this._enumerateSubStates.bind(this);
        this._addContext = this._addContext.bind(this);
        this._subStatesInContext = subStates.map(s => this._addContext([], s));
        this._allSubStates = Array.prototype.concat(...this._subStatesInContext.map(this._enumerateSubStates));
        this._filterCondition = filterCondition;
    }

    public findRoot(): SubStateInContext {
        const result = this._subStatesInContext.find(state => !!state.root);
        if (result) {
            return result;
        } else {
            console.log('No root in:', this._subStatesInContext);
            throw new Error("Can't find root subState");
        }
    }

    public findSubState(currentTokens: (string | null)[], parsedTokens = 0): SubStateInContext | null {
        const level = parsedTokens;
        const keyToken = currentTokens[level];
        if (isTokenEmpty(keyToken)) {
            return this.findRoot();
        }
        const result = this._allSubStates.find(state => {
            const { isGroupOnly, totalPathTokens, root } = state;
            const matches =
                !isGroupOnly && doTokenStringsMatch(currentTokens, totalPathTokens, parsedTokens, !!root, this._debug);
            if (this._debug) {
                console.log(
                    'State space handler',
                    this._id,
                    'Testing state',
                    state,
                    'current tokens',
                    currentTokens,
                    'state tokens',
                    totalPathTokens,
                    'parsedTokens',
                    parsedTokens,
                    'match?',
                    matches
                );
            }
            return matches;
        });
        if (result) {
            return result;
        } else {
            // const validKeys = this._subStatesInContext.map(s => s.key);
            // console.log('Nothing found when looking for a state with key', keyToken, 'valid keys are:', validKeys);
            // console.log('all subStates are', this._allSubStates);
            return null;
        }
    }

    public getFilteredSubStates(): SubStateInContext[] {
        return filterSubStates(this._subStatesInContext, this._filterCondition);
    }
}
