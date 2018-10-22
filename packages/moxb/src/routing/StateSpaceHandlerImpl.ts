import { SubState, StateCondition } from "./StateSpace";
import { StateSpaceHandler, StateSpaceHandlerProps } from "./StateSpaceHandler";

export class StateSpaceHandlerImpl implements StateSpaceHandler {

    protected readonly _substates: SubState[];
    protected readonly _filterCondition?: StateCondition;

    public constructor(props: StateSpaceHandlerProps) {
        this._substates = props.substates;
        this._filterCondition = props.filterCondition;
    }

    public findRoot(): SubState {
        const result = this._substates.find(state => !!state.root);
        if (result) {
            return result;
        } else {
            throw new Error("Can't find root subState");
        }
    }

    public findSubState(path: string): SubState {
        if (!path || (path === '') || (path === '_root_')) {
            return this.findRoot();
        }
        const result = this._substates.find(state => state.path === path);
        if (result) {
            return result;
        } else {
            throw new Error("Can't find subState for path " + path);
        }
    }

    public getFilteredSubStates(): SubState[] {
        const filter = this._filterCondition;
        return this._substates.filter(
            state => !state.hidden && (!filter || filter(state)),
        );
    }
}
