import { doTokenStringsMatch } from '../../tokens';
import { StateCondition, StateSpace, SubState, SubStateInContext } from './StateSpace';
import { FilterParams, StateSpaceHandler, StateSpaceHandlerProps } from './StateSpaceHandler';
import { SubStateKeyGenerator } from './SubStateKeyGenerator';
import { SubStateKeyGeneratorImpl } from './SubStateKeyGeneratorImpl';
import { NavStateHooks } from '../../navigable';

/**
 * Recursively filter out the sub-states that are hidden or don't match the filter
 *
 * @param states the SubStates to start with
 * @param condition the optional condition to use for filtering
 * @param params Configuration about what to filter for
 */
function filterSubStates<LabelType, WidgetType, DataType>(
    states: SubStateInContext<LabelType, WidgetType, DataType>[],
    condition: StateCondition<DataType> | undefined,
    params: FilterParams
): SubStateInContext<LabelType, WidgetType, DataType>[] {
    return states
        .filter(state => {
            // Filter based on visibility
            if (params.onlyVisible && state.hidden) {
                return false;
            }
            // Filter based on the condition
            if (params.onlySatisfying && condition && !condition(state.data)) {
                return false;
            }
            if (params.noDisplayOnly && state.displayOnly) {
                return false;
            }
            // All good
            return true;
        })
        .map(state => {
            if (state.subStates) {
                return {
                    ...state,
                    subStates: filterSubStates(state.subStates, condition, params),
                };
            } else {
                return state;
            }
        });
}

interface HookMap {
    [index: string]: NavStateHooks;
}

/**
 * This is the standard implementation for StateSpaceHandler.
 *
 * See the StateSpaceHandler interface for more details.
 */
export class StateSpaceHandlerImpl<LabelType, WidgetType, DataType>
    implements StateSpaceHandler<LabelType, WidgetType, DataType> {
    protected readonly _id: string;
    protected readonly _debug?: boolean;
    protected readonly _keyGen: SubStateKeyGenerator;
    protected readonly _subStates: StateSpace<LabelType, WidgetType, DataType>;
    public readonly _subStatesInContext: SubStateInContext<LabelType, WidgetType, DataType>[];
    protected readonly _allSubStates: SubStateInContext<LabelType, WidgetType, DataType>[];
    protected readonly _filterCondition?: StateCondition<DataType>;
    public readonly stateHooks: HookMap = {};

    /**
     * Add context info around a given sub-state
     *
     * @param parentPathTokens the path tokens required to reach this the level where this sub-state is directly selectable
     * @param state The sub-state to work with
     */
    protected _addContext(
        parentPathTokens: string[],
        state: SubState<LabelType, WidgetType, DataType>
    ): SubStateInContext<LabelType, WidgetType, DataType> {
        const { root, key, subStates, flat, pathTokens } = state;
        const newTokens = !!subStates ? (flat ? [] : [key!]) : root ? [] : [key!];
        const totalPathTokens: string[] = pathTokens ? pathTokens : [...parentPathTokens, ...newTokens];
        return {
            ...state,
            parentPathTokens,
            totalPathTokens,
            isGroupOnly: !!subStates,
            subStates: subStates ? subStates.map(s => this._addContext(totalPathTokens, s)) : undefined,
            menuKey: this._keyGen.getKey(parentPathTokens, state),
        };
    }

    protected _enumerateSubStates(
        state: SubStateInContext<LabelType, WidgetType, DataType>
    ): SubStateInContext<LabelType, WidgetType, DataType>[] {
        const subStates: SubStateInContext<LabelType, WidgetType, DataType>[] = state.subStates
            ? Array.prototype.concat(...state.subStates.map(s => this._enumerateSubStates(s)))
            : [];
        return [state, ...subStates];
    }

    public constructor(props: StateSpaceHandlerProps<LabelType, WidgetType, DataType>) {
        const { id, keyGen, subStates, filterCondition, debug } = props;
        this._id = id || 'no-id';
        this._debug = debug;
        this._keyGen = keyGen || new SubStateKeyGeneratorImpl();
        this._enumerateSubStates = this._enumerateSubStates.bind(this);
        this._addContext = this._addContext.bind(this);
        this._subStates = subStates;
        this._subStatesInContext = subStates.map(s => this._addContext([], s));
        this._allSubStates = Array.prototype.concat(...this._subStatesInContext.map(this._enumerateSubStates));
        this._filterCondition = filterCondition;
    }

    public findRoot(): SubStateInContext<LabelType, WidgetType, DataType> {
        const result = this._subStatesInContext.find(state => !!state.root);
        if (result) {
            return result;
        } else {
            console.log('No root in:', this._subStatesInContext);
            throw new Error("Can't find root subState");
        }
    }

    /**
     * Does the given sub-state (group) has any active sub-states, for the given set of tokens?
     *
     * @param state The sub-state to check
     * @param wantedTokens The token list to check against
     * @param parsedTokens The number of tokens already parser
     * @private
     */
    protected _hasActiveSubStateForTokens(
        state: SubStateInContext<LabelType, WidgetType, DataType>,
        wantedTokens: (string | null)[],
        parsedTokens = 0
    ): boolean {
        const { subStates, isGroupOnly, flat } = state;
        if (!isGroupOnly || !flat) {
            throw new Error('This method is only for flat groups');
        }
        let result = false;
        subStates!.forEach(subState => {
            if (this.isSubStateActiveForTokens(subState, wantedTokens, parsedTokens)) {
                result = true;
            }
        });
        return result;
    }

    /**
     * Is the given sub-state active for a given set of tokens?
     *
     * @param state The sub-state to check
     * @param wantedTokens The token list to check against
     * @param parsedTokens The number of tokens already parser
     */
    public isSubStateActiveForTokens(
        state: SubStateInContext<LabelType, WidgetType, DataType>,
        wantedTokens: (string | null)[],
        parsedTokens = 0
    ) {
        const { isGroupOnly, flat, totalPathTokens, root } = state;
        if (isGroupOnly && flat) {
            return this._hasActiveSubStateForTokens(state, wantedTokens, parsedTokens);
        }
        const matches =
            !isGroupOnly && doTokenStringsMatch(wantedTokens, totalPathTokens, parsedTokens, !!root, this._debug);
        if (this._debug) {
            console.log(
                'State space handler',
                this._id,
                'Testing state',
                state,
                'current tokens',
                wantedTokens,
                'state tokens',
                totalPathTokens,
                'parsedTokens',
                parsedTokens,
                'match?',
                matches
            );
        }
        return matches;
    }

    public getActiveSubStatesForTokens(wantedTokens: (string | null)[], parsedTokens: number, onlyLeaves: boolean) {
        const states = this.getFilteredSubStates({
            recursive: true,
            onlyLeaves,
            onlySatisfying: true,
            noDisplayOnly: true,
        });
        const results = states.filter(state => this.isSubStateActiveForTokens(state, wantedTokens, parsedTokens));
        return results;
    }

    public findSubStateForTokens(
        wantedTokens: (string | null)[],
        parsedTokens = 0
    ): SubStateInContext<LabelType, WidgetType, DataType> | null {
        const results = this.getActiveSubStatesForTokens(wantedTokens, parsedTokens, true);
        switch (results.length) {
            case 0:
                // const validKeys = this._subStatesInContext.map(s => s.key);
                // console.log('Nothing found when looking for a state with key', keyToken, 'valid keys are:', validKeys);
                // console.log('all subStates are', this._allSubStates);
                return null;
            case 1:
                return results[0];
            default:
                // We have multiple matches.
                console.log(results);
                throw new Error('Multiple identical keys on the same level are unsupported.');
        }
    }

    public getFilteredSubStates(params: FilterParams): SubStateInContext<LabelType, WidgetType, DataType>[] {
        const result = filterSubStates(
            params.recursive ? this._allSubStates : this._subStatesInContext,
            this._filterCondition,
            params
        );
        return params.onlyLeaves ? result.filter(s => !s.isGroupOnly) : result;
    }

    registerNavStateHooksForSubState(
        subState: SubStateInContext<LabelType, WidgetType, DataType> | null,
        hooks: NavStateHooks
    ) {
        if (!subState) {
            // console.log('Ignoring dirty tester for missing subState');
        } else {
            // console.log('SubState', subState.menuKey, 'has state hooks', hooks);
            this.stateHooks[subState.menuKey] = hooks;
        }
    }
}
