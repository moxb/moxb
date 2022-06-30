import { NavRef, NavRefCall } from '../../navigation-references';
import { PathTokenMappingList } from '../../TokenManagerImpl';

/**
 * Core data about sub-states
 */
export interface SubStateCoreInfo<WidgetType, DataType> {
    /**
     * What content to show in this sub-state?
     */
    fragment?: WidgetType;

    /**
     * Custom data which can be used for permission checks, etc
     */
    data?: DataType;

    /**
     * Optional token mapping for this sub-state
     *
     * When provided, the router will automatically assign names to any remaining tokens.
     */
    tokenMapping?: PathTokenMappingList;
}

/**
 * Information about how this sub-states fits into it's environment
 */
export interface SubStateRelations<LabelType, WidgetType, DataType> {
    /**
     * The key to identify this sub-state. (Can be undefined if this is the root state.)
     */
    key?: string;

    /**
     * Is this the root state?
     */
    root?: boolean;

    /**
     * Any further child states (for sub-menus, etc)
     */
    subStates?: SubState<LabelType, WidgetType, DataType>[];

    /**
     * If this is a group menu item, should the items in this group be added "flat" in the same space,
     * without prefixing the key of this state? (defaults to false.)
     */
    flat?: boolean;

    /**
     * Display-only sub-states are only considered when drawing menus, but not considered
     * when doing the actual routing.
     *
     * The main use-case is to add arbitrary menu items which will do random stuff, instead
     * of simply navigating to a sub-state
     */
    displayOnly?: boolean;

    /**
     * Specify an arbitrary list of path tokens to use for this sub-state.
     */
    pathTokens?: string[];

    /**
     * Use a NavRef scheme to specify where this state should point to.
     *
     * If given, pathTokens are ignored.
     *
     * Note that this can only be used if the given NavRev scheme has been
     * attached to a state somewhere else in the menu system.
     */
    navRefCall?: NavRefCall<any>;

    /**
     * Specify a NavRef schema, which can be used to address to this navigation state.
     *
     * Note that this doesn't change anything about this state;
     * it just makes it addressable using the schema that we are attaching here.
     */
    navRef?: NavRef<any>;
}

/**
 * Information about displaying this sub-statein menus
 */
export interface SubStateDisplayInfo<LabelType> {
    /**
     * Should this option be offered in menus and such?
     */
    hidden?: boolean;

    /**
     * Is this option currently disabled?
     *
     * If yes, this will option will be displayed, but won't be selectable.
     */
    disabled?: boolean;

    /**
     * The label to identify this sub-state,
     *
     * when offered up for selection in a menu or similar
     */
    label?: LabelType;

    /**
     * Do we want to show some text when hovering with the cursor above the label?
     */
    title?: string;

    /**
     * A special label to use when this sub-state is active
     */
    activeLabel?: LabelType;

    /**
     * When showing this in a menu, should we open link in a new window?
     */
    newWindow?: boolean;

    /**
     * Extra classes to use then displaying the menu item
     */
    itemClassName?: string;

    /**
     * Extra classes to use when displaying the link
     */
    linkClassName?: string;

    /**
     * Extra styles to use when displaying the link
     */
    linkStyle?: any;

    /**
     * Don't render this element as a link in menus, since it's some kind
     * of custom component, which will be provided as the label.
     */
    noLink?: boolean;

    /**
     * Is this a separator? If yes, nothing else needs to be specified.
     */
    separator?: boolean;

    /**
     * Style to be added to the main div.
     */
    containerStyle?: any;
}

/**
 * This interface describes a possible state for a part of the app UI.
 *
 * It includes all parameters related to both rendering menus and the routing.
 *
 * Since this data structure is UI-Framework agnostic,
 * you will have to provide your own UI-related types (label and content)
 * as type parameters.
 */
export type SubState<LabelType, WidgetType, DataType> = SubStateCoreInfo<WidgetType, DataType> &
    SubStateRelations<LabelType, WidgetType, DataType> &
    SubStateDisplayInfo<LabelType>;

/**
 * The totality of all possible states for a given part of the app UI
 */
export interface StateSpace<LabelType, WidgetType, DataType> {
    /**
     * Generic data related to this state space.
     *
     * Currently, this is only used for debugging purposes and can be safely omitted.
     */
    metaData: string;

    /**
     * The list of possible sub-states within this state
     */
    subStates: SubState<LabelType, WidgetType, DataType>[];

    /**
     * How do we define the sub-state in case we are at an undefined location?
     */
    fallback?: WidgetType;
}

/**
 * A condition used to decide whether a given SubState should be available
 */
export type StateCondition<DataType> = (data?: DataType) => boolean;
