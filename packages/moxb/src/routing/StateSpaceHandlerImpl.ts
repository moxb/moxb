import { SubState } from "./StateSpace";
import { LocationManager } from "./LocationManager";
import { StateSpaceHandler, StateSpaceHandlerProps } from "./StateSpaceHandler";
import { UrlArg } from "./UrlArg";

export class StateSpaceHandlerImpl implements StateSpaceHandler {

    private readonly _locationManager: LocationManager;
    private readonly _substates: SubState[];
    private readonly _urlArg?: UrlArg<string>;
    private readonly _rootPath?: string;

    public constructor(props: StateSpaceHandlerProps) {
        const { locationManager, substates, rootPath, arg } = props;
        this._locationManager = locationManager;
        this._substates = substates;
        this._urlArg = arg;
        this._rootPath = rootPath;
        this.isSubStateActive = this.isSubStateActive.bind(this);
    }

    public getPathForSubState(state: SubState) {
        const { root, path } = state;
        const realRootPath = this._rootPath || this._locationManager.pathSeparator;
        const result = realRootPath + (root ? '' : path);
        return result;
    }

    public isSubStateActive(state: SubState) {
        const { root, path } = state;
        if (root || path) {
            if (this._urlArg) {
                return this._urlArg.value === path;
            } else {
                const toPath = this.getPathForSubState(state);
                return this._locationManager.isLinkActive(toPath, !!root);
            }
        } else {
            return false;
        }
    }

    public getActiveSubStates(): SubState[] {
        return this._substates
            .filter(this.isSubStateActive);
    }

    public getActiveSubStatePaths(): string[] {
        return this.getActiveSubStates()
            .map(state => state.path!);
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
