import { SubState } from "./StateSpace";
import { StateSpaceHandler, StateSpaceHandlerProps } from "./StateSpaceHandler";

export class StateSpaceHandlerImpl implements StateSpaceHandler {

    protected readonly _substates: SubState[];

    public constructor(props: StateSpaceHandlerProps) {
        this._substates = props.substates;
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
        if (path === '_root_') {
            return this.findRoot();
        }
        const result = this._substates.find(state => state.path === path);
        if (result) {
            return result;
        } else {
            throw new Error("Can't find subState for path " + path);
        }
    }
}
