import { NavRef, NavRefCall } from '../../navigation-references';

export interface SubStateCoreInfo<WidgetType, DataType> {
    /**
     * What content so show in this sub-state?
     */
    fragment?: WidgetType;

    /**
     * Custom data
     */
    data?: DataType;

    /**
     * Names for any remaining tokens, if required
     */
    tokenMapping?: string[];
}

export interface SubStateRelations<LabelType, WidgetType, DataType> {
    /**
     * The key to identify this sub-state. (Can be undefined if this is the root state)
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
     * when doing the actual routing. The main use-case is to add arbitrary menu items
     */
    displayOnly?: boolean;

    /**
     * Specify an arbitrary list of path tokens to use for this sub-state
     */
    pathTokens?: string[];

    /**
     * Use a NavRef scheme to specify where this state should point to.
     *
     * If given, pathTokens are ignored.
     *
     * Note that this can only be used if the given NavRev scheme has been
     * attached to a state somewhere else in the menu.
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

export interface SubStateDisplayInfo<LabelType> {
    /**
     * Should this option be offered in menus and such?
     */
    hidden?: boolean;

    /**
     * Is this option currently disabled? If yes, this will option will be displayed, but won't be selectable.
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
    linkStyle?: React.CSSProperties;

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
    containerStyle?: React.CSSProperties;
}

/**
 * This interface describes a possible state for a part of the app UI
 *
 * Since this data structure is UI-Framework agnostic,
 * you will have to provide your own UI-related (label and content) types
 * as type parameters.
 */
export interface SubState<LabelType, WidgetType, DataType>
    extends SubStateCoreInfo<WidgetType, DataType>,
        SubStateRelations<LabelType, WidgetType, DataType>,
        SubStateDisplayInfo<LabelType> {}

/**
 * The totality of all possible states for a given part of the app UI
 */
export type StateSpace<LabelType, WidgetType, DataType> = SubState<LabelType, WidgetType, DataType>[];

/**
 * This interface describes how the identify a sub-state within a state-space
 */
export interface SubStateInContext<LabelType, WidgetType, DataType> extends SubState<LabelType, WidgetType, DataType> {
    /**
     * What are the parent path tokens to choose to reach the level
     * where the current sub-state is directly accessible?
     */
    parentPathTokens: string[];

    /**
     * What are the parent path tokens to choose to reach this sub-state?
     */
    totalPathTokens: string[];

    /**
     * Is this only a group item, created for menus?
     */
    isGroupOnly: boolean;

    /**
     * The menu key generated for this sub-state
     */
    menuKey: string;

    /**
     * We are restricting the SubStates array so that we know that they all must have context, too
     */
    subStates?: SubStateInContext<LabelType, WidgetType, DataType>[];
}

/**
 * A condition used to decide whether or not to offer a given SubState
 */
export type StateCondition<DataType> = (data?: DataType) => boolean;
