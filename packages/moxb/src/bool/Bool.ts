import { Value } from '../value/Value';

export interface Bool extends Value<boolean> {
    toggle(): void;

    /**
     * A label that can be used when the boolean is bound to a toggle menu action.
     */
    readonly labelToggle: string | undefined;
}
