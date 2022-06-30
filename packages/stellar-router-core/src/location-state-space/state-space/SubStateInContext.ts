import { SubState } from './StateSpace';

/**
 * This interface describes the extra data the routing system will store about a sub-state inside a state-space.
 *
 * This is an implementation detail, you shouldn't care about it, unless you are developing
 * some kind of integration with the routing system.
 *
 * All the data found here will be auto-generated by the routing system on the go.
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
     * Mete-data about the original state-space where this sub-state comes from
     */
    metaData: any;

    /**
     * We are restricting the SubStates array so that we know that they all must have context, too
     */
    subStates?: SubStateInContext<LabelType, WidgetType, DataType>[];
}