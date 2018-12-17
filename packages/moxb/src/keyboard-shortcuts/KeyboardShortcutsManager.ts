import { Action } from '../action/Action';

/**
 * A set of shortcuts that can be enabled independently
 */
export interface KeyboardShortcutGroup {
    readonly id: string;
    readonly label?: string;
    readonly enabled: boolean;
    readonly shortcuts: Action[];
}

export interface KeyboardShortcutsManager {
    /**
     * With this method you can register new shortcuts in the global keyboard shortcuts manager
     * @param {KeyboardShortcutGroup} shortcuts
     */
    registerKeyboardShortcuts(shortcuts: KeyboardShortcutGroup): void;

    /**
     * With this method you can unregister shortcuts in the global keyboard shortcuts manager
     * @param {KeyboardShortcutGroup} shortcuts
     */
    unregisterKeyboardShortcuts(shortcuts: KeyboardShortcutGroup): void;

    /**
     * All registered shortcut groups
     */
    readonly shortcuts: KeyboardShortcutGroup[];

    /**
     * A markdown representation of the actions
     */
    readonly actionMd: string;
}
