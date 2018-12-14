import { Bind } from '../bind/Bind';

export interface Action extends Bind {
    fire(): void;
    firePromise(): Promise<void>;
    readonly pending: boolean;
    /**
     * Keyboard shortcuts associated with this action. Interpretation depends on the implementation in the
     * {@Keyboard}
     */
    readonly keyboardShortcuts: string[];
}
