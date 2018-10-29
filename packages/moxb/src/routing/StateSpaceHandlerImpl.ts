import { SubState, StateCondition } from './StateSpace';
import { StateSpaceHandler, StateSpaceHandlerProps } from './StateSpaceHandler';

// Recursively filter out the sub-states that are hidden or don't match the filter
function filterSubStates(states: SubState[], filter?: StateCondition): SubState[] {
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

export class StateSpaceHandlerImpl implements StateSpaceHandler {
    protected readonly _subStates: SubState[];
    protected readonly _filterCondition?: StateCondition;

    public constructor(props: StateSpaceHandlerProps) {
        this._subStates = props.subStates;
        this._filterCondition = props.filterCondition;
    }

    public findRoot(): SubState {
        const result = this._subStates.find(state => !!state.root);
        if (result) {
            return result;
        } else {
            throw new Error("Can't find root subState");
        }
    }

    public findSubState(tokens: string[], parsedTokens = 0): SubState | null {
        const level = parsedTokens;
        const token = tokens[level];
        if (!token || token === '' || token === '_root_') {
            return this.findRoot();
        }
        const result = this._subStates.find(state => state.key === token);
        if (result) {
            return result;
        } else {
            return null;
        }
    }

    public getFilteredSubStates(): SubState[] {
        return filterSubStates(this._subStates, this._filterCondition);
    }
}
