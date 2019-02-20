import { LocationManager, SuccessCallback, UpdateMethod } from '../location-manager';
import { TestLocation } from '../location-manager/LocationManager';
import { LeaveQuestionGenerator } from '../navigable';
import { TokenManager } from '../TokenManager';
import { updateTokenString } from '../tokens';
import { AnyUrlArgImpl, UrlArg, URLARG_TYPE_ORDERED_STRING_ARRAY } from '../url-arg';
import {
    LocationDependentStateSpaceHandler,
    LocationDependentStateSpaceHandlerProps,
} from './LocationDependentStateSpaceHandler';
import { SubStateInContext } from './state-space/StateSpace';
import { StateSpaceHandlerImpl } from './state-space/StateSpaceHandlerImpl';

/**
 * This is the standard implementation of the StateSpaceAndLocationHandler.
 *
 * See the StateSpaceAndLocationHandler interface for more details.
 */
export class LocationDependentStateSpaceHandlerImpl<LabelType, WidgetType, DataType>
    extends StateSpaceHandlerImpl<LabelType, WidgetType, DataType>
    implements LocationDependentStateSpaceHandler<LabelType, WidgetType, DataType> {
    protected readonly _locationManager: LocationManager;
    protected readonly _tokenManager: TokenManager;
    protected readonly _urlArg?: UrlArg<string[]>;
    protected readonly _parsedTokens: number;
    protected _mappingId?: string;

    getId() {
        return this._id;
    }

    /**
     * This is our "change interceptor" hook, that will be called by the LocationManager.
     */
    anyQuestionsFor(location: TestLocation): string[] {
        //        console.log("Should test whether it's OK to go to", location.pathTokens);

        // Find out which states are active now
        const oldSubStates = this.getActiveSubStates(true);

        // Find out which states would be active after the change
        const newSubStates = this.getActiveSubStatesForTokens(
            this._getTestTokens(location),
            this._getParsedTokenCount(),
            true
        );

        // Find out which states would be disabled by the change
        const disabledSubStates = oldSubStates.filter(s => newSubStates.indexOf(s) === -1);

        // Collect testers belonging to the would-be deactivated states
        const activeTesters = disabledSubStates
            .filter(state => !!this.stateHooks[state.menuKey]) // Get the states that have hooks
            .map(s => this.stateHooks[s.menuKey].getLeaveQuestion) // get the leave question generators
            .filter(gen => !!gen) as LeaveQuestionGenerator[]; // filter the omitted generators // We know that these are all real

        // Collect and return all the questions
        return activeTesters // for all active question generators
            .map(test => test()) // get the questions
            .filter(q => !!q) as string[]; // filter out undefined // we know that these are all strings, since we have filtered the junk
    }

    public constructor(props: LocationDependentStateSpaceHandlerProps<LabelType, WidgetType, DataType>) {
        super(props);
        const { locationManager, tokenManager, parsedTokens, arg, intercept } = props;
        this._locationManager = locationManager!;
        if (intercept) {
            /**
             * We register ourselves as a change interceptor,
             * because we might have to hide some content
             * on location changes, and we want to know about that
             * in advance, so that we can suggest some questions to ask
             * from the user.
             */
            this._locationManager.registerChangeInterceptor(this);
        }
        this._tokenManager = tokenManager!;
        // Here, we are trying to wrap another URL argument around the passed-in one,
        // So that it can support multi-token values (?q=foo.bar)
        // We are using the originally defined arg as a back-end for this new var.
        this._urlArg = arg
            ? new AnyUrlArgImpl(
                  {
                      key: arg.key,
                      valueType: URLARG_TYPE_ORDERED_STRING_ARRAY,
                      defaultValue:
                          typeof arg.defaultValue === 'object'
                              ? arg.defaultValue
                              : URLARG_TYPE_ORDERED_STRING_ARRAY.getParser(arg.key)(arg.defaultValue) || [],
                  },
                  {
                      get rawValue() {
                          return arg!.value;
                      },
                      rawValueOn(location: TestLocation) {
                          return arg.valueOn(location);
                      },
                      doSet(value) {
                          arg!.doSet(value);
                      },
                      trySet(value, callback?: SuccessCallback) {
                          arg!.trySet(value, undefined, callback);
                      },
                      getModifiedUrl(value: string) {
                          return arg.getModifiedUrl(value);
                      },
                  }
              )
            : undefined;
        this._parsedTokens = parsedTokens || 0;
        if (this._debug) {
            console.log('Parsed tokens for state-space-and-location-handler', this._id, ':', this._parsedTokens);
        }
        this.isSubStateActive = this.isSubStateActive.bind(this);
    }

    public registerTokenMappings() {
        this._mappingId = this._tokenManager.addMappings({
            id: 'mappings for ' + this._id,
            subStates: this._subStates,
            parsedTokens: this._parsedTokens,
            filterCondition: this._filterCondition,
        });
    }

    public unregisterTokenMappings() {
        this._tokenManager.removeMappings(this._mappingId!);
    }

    /**
     * Get the current tokens
     */
    protected _getCurrentTokens(): string[] {
        return this._urlArg ? this._urlArg.value : this._locationManager.pathTokens;
    }

    /**
     * Get the current tokens
     */
    protected _getTestTokens(location: TestLocation): string[] {
        return this._urlArg ? this._urlArg.valueOn(location) : location.pathTokens;
    }

    /**
     * Get the current number of parsed tokens
     */
    protected _getParsedTokenCount(): number {
        return this._urlArg ? 0 : this._parsedTokens;
    }

    /**
     * Is the give sub-state currently active?
     */
    public isSubStateActive(state: SubStateInContext<LabelType, WidgetType, DataType>) {
        return this.isSubStateActiveForTokens(state, this._getCurrentTokens(), this._getParsedTokenCount());
    }

    /**
     * Return a list of currently active sub-states
     * @param leavesOnly Should we skip groups?
     */
    public getActiveSubStates(leavesOnly: boolean): SubStateInContext<LabelType, WidgetType, DataType>[] {
        return this.getActiveSubStatesForTokens(this._getCurrentTokens(), this._getParsedTokenCount(), leavesOnly);
    }

    /**
     * Return the single active sub-state leaf, if any
     */
    public getActiveSubState(): SubStateInContext<LabelType, WidgetType, DataType> | null {
        return this.findSubStateForTokens(this._getCurrentTokens(), this._getParsedTokenCount());
    }

    /**
     * Return the list of menu-keys of the currently active sub-states
     * @param leavesOnly Should we skip groups?
     */
    public getActiveSubStateMenuKeys(leavesOnly: boolean): string[] {
        return this.getActiveSubStates(leavesOnly).map(state => state.menuKey);
    }

    /**
     * Calculate what would be the string value of the the argument if we select a given sub-state
     *
     * @param state The sub-state to select
     */
    protected _getArgValueForSubState(state: SubStateInContext<LabelType, WidgetType, DataType>): string[] {
        const currentTokens = this._urlArg!.value;
        const newTokens = updateTokenString(currentTokens, 0, state.totalPathTokens);
        return newTokens;
    }

    /**
     * Return the URL that would select a given sub-state
     */
    public getUrlForSubState(state: SubStateInContext<LabelType, WidgetType, DataType>): string {
        if (this._urlArg) {
            const value = this._getArgValueForSubState(state);
            const url = this._urlArg.getModifiedUrl(value);
            if (url === undefined) {
                throw new Error(this._id + ": can't generate a link based on a non-URL arg!");
            } else {
                return url;
            }
        } else {
            return this._locationManager.getURLForPathTokens(this._parsedTokens, state.totalPathTokens);
        }
    }

    /**
     * Select the given sub-state
     *
     * @param state The sub-state to select
     * @param method The method for updating the URL
     */
    public doSelectSubState(state: SubStateInContext<LabelType, WidgetType, DataType>, method?: UpdateMethod) {
        const { totalPathTokens } = state;
        if (this._urlArg) {
            const value = this._getArgValueForSubState(state);
            this._urlArg.doSet(value);
        } else {
            this._locationManager.doSetPathTokens(this._parsedTokens, totalPathTokens, method);
        }
    }

    public trySelectSubState(
        state: SubStateInContext<LabelType, WidgetType, DataType>,
        method?: UpdateMethod,
        callback?: SuccessCallback
    ) {
        const { totalPathTokens } = state;
        if (this._urlArg) {
            const value = this._getArgValueForSubState(state);
            this._urlArg.trySet(value, method, callback);
        } else {
            this._locationManager.trySetPathTokens(this._parsedTokens, totalPathTokens, method, callback);
        }
    }

    /**
     * Select the sub-state addressed by the given string of tokens
     */
    public doSelectByTokens(wantedTokens: string[]) {
        const subState = this.findSubStateForTokens(wantedTokens);
        if (subState) {
            this.doSelectSubState(subState);
        } else {
            throw new Error("Couldn't find sub-state with tokens [" + wantedTokens.join(', ') + '].');
        }
    }
}
