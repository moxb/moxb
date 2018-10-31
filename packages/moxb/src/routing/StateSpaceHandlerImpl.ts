import { SubState, StateCondition, SubStateInContext } from './StateSpace';
import { StateSpaceHandler, StateSpaceHandlerProps } from './StateSpaceHandler';
import { SubStateKeyGenerator } from './SubStateKeyGenerator';
import { SubStateKeyGeneratorImpl } from './SubStateKeyGeneratorImpl';

export function isTokenEmpty(token: string | undefined): boolean {
    return token === '' || token === null || token === undefined;
}

export function doTokensMatch(token1: string | undefined, token2: string | undefined): boolean {
    const empty1 = isTokenEmpty(token1);
    const empty2 = isTokenEmpty(token2);
    return (empty1 && empty2) || token1 === token2;
}

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
    protected readonly _keyGen: SubStateKeyGenerator;
    protected readonly _subStates: SubStateInContext[];
    protected readonly _allSubStates: SubStateInContext[];
    protected readonly _filterCondition?: StateCondition;

    /**
     * Add context info around a given sub-state
     *
     * @param parentPathTokens the path tokens required to reach this the level where this sub-state is directly selectable
     * @param state The sub-state to work with
     */
    protected _addContext(parentPathTokens: string[], state: SubState): SubStateInContext {
        const { root, key, subStates } = state;
        const totalPathTokens: string[] = [...parentPathTokens, root ? '' : key!];
        const result: SubStateInContext = {
            ...state,
            parentPathTokens,
            totalPathTokens,
            menuKey: '',
            subStates: subStates ? subStates.map(s => this._addContext(totalPathTokens, s)) : undefined,
        };
        result.menuKey = this._keyGen.getKey(result);
        return result;
    }

    protected _enumerateSubStates(state: SubStateInContext): SubStateInContext[] {
        const subStates: SubStateInContext[] = state.subStates
            ? Array.prototype.concat(...state.subStates.map(s => this._enumerateSubStates(s)))
            : [];
        return [state, ...subStates];
    }

    public constructor(props: StateSpaceHandlerProps) {
        this._keyGen = props.keyGen || new SubStateKeyGeneratorImpl();
        this._enumerateSubStates = this._enumerateSubStates.bind(this);
        this._addContext = this._addContext.bind(this);
        this._subStates = props.subStates.map(s => this._addContext([], s));
        this._allSubStates = Array.prototype.concat(...this._subStates.map(this._enumerateSubStates));
        this._filterCondition = props.filterCondition;
    }

    public findRoot(): SubStateInContext {
        const result = this._subStates.find(state => !!state.root);
        if (result) {
            return result;
        } else {
            console.log('No root in:', this._subStates);
            throw new Error("Can't find root subState");
        }
    }

    public findSubState(currentTokens: string[], parsedTokens = 0): SubStateInContext | null {
        const level = parsedTokens;
        const keyToken = currentTokens[level];
        if (isTokenEmpty(keyToken)) {
            return this.findRoot();
        }
        const result = this._subStates.find(state => doTokensMatch(state.key, keyToken));
        if (result) {
            return result;
        } else {
            // const validKeys = this._subStates.map(s => s.key);
            // console.log('Nothing found when looking for a state with key', token, 'valid keys are:', validKeys);
            return null;
        }
    }

    public getFilteredSubStates(): SubStateInContext[] {
        return filterSubStates(this._subStates, this._filterCondition);
    }
}
