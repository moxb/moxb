import { Bind } from '../bind/Bind';

export interface Action extends Bind {
    /**
     * A confirmation question that should be put to the user before really firing the action
     */
    readonly confirmQuestion?: string;

    fire(): void;

    firePromise(): Promise<void>;

    readonly pending: boolean;
    /**
     * Keyboard shortcuts associated with this action. Interpretation depends on the implementation in the
     * {@Keyboard}
     */
    readonly keyboardShortcuts: string[];
}
