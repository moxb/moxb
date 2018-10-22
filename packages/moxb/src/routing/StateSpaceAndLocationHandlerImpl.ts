import { SubState } from "./StateSpace";
import { LocationManager } from "./LocationManager";
import { StateSpaceAndLocationHandler, StateSpaceAndLocationHandlerProps } from "./StateSpaceAndLocationHandler";
import { StateSpaceHandlerImpl } from "./StateSpaceHandlerImpl";
import { UrlArg } from "./UrlArg";

export class StateSpaceAndLocationHandlerImpl extends StateSpaceHandlerImpl implements StateSpaceAndLocationHandler {

    private readonly _locationManager: LocationManager;
    private readonly _urlArg?: UrlArg<string>;
    private readonly _rootPath?: string;

    public constructor(props: StateSpaceAndLocationHandlerProps) {
        super(props);
        const { locationManager, rootPath, arg } = props;
        this._locationManager = locationManager;
        this._urlArg = arg;
        this._rootPath = rootPath;
        this.isSubStateActive = this.isSubStateActive.bind(this);
    }

    public getRealPathForSubState(state: SubState) {
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
                const toPath = this.getRealPathForSubState(state);
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

}
