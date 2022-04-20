import { action as mobxAction, computed, observable, makeObservable } from 'mobx';
import { StringOrFunction } from '../bind/BindImpl';
import { t } from '../i18n/i18n';

import { KeyboardAction, KeyboardShortcutGroup, KeyboardShortcutsManager } from './KeyboardShortcutsManager';
import { AnyDecision, readDecision } from '../decision';

export interface KeyboardShortGroupOptions {
    readonly id: string;
    /**
     * If label is a function it assumes that the function returns a translated label.
     * If label is a string, the assumption is that this is the default translation and the translation key is `id.label`
     */
    label?: StringOrFunction;

    /**
     * Note: you can either specify a `disabled` or an `enabled` function!
     *
     * @returns {boolean} `true` if the the element should be disabled
     */
    disabled?(): AnyDecision;

    /**
     * Note: you can either specify a `disabled` or an `enabled` function!
     * @returns {boolean} `false` if the element should be disabled
     */
    enabled?(): AnyDecision;

    /**
     * Must be a non changing list
     */
    readonly shortcuts: KeyboardAction[];
}

export class KeyboardShortcutGroupImpl implements KeyboardShortcutGroup {
    readonly id: string;
    readonly shortcuts: KeyboardAction[];
    constructor(private readonly impl: KeyboardShortGroupOptions) {
        this.id = impl.id;
        this.shortcuts = impl.shortcuts.slice();
    }
    get label() {
        if (typeof this.impl.label === 'function') {
            return this.impl.label();
        }
        if (this.impl.label != null) {
            return t(this.id + '.label', this.impl.label);
        }
        return undefined;
    }
    get enabled() {
        if (this.impl.disabled) {
            return !readDecision(this.impl.disabled());
        }
        if (this.impl.enabled) {
            return readDecision(this.impl.enabled());
        }
        return true;
    }
}

/**
 * The implementation of a keyboard bind function -- typically something like mousetrap
 */
export interface ShortcutBinder {
    bind(key: string, action: () => void): void;
    unbind(key: string): void;
}

export class KeyboardActionDecorator implements KeyboardAction {
    constructor(private readonly action: KeyboardAction) {}
    get label() {
        return this.getLabel();
    }
    protected getLabel() {
        return this.action.label;
    }
    get keyboardShortcuts() {
        return this.getKeyboardShortcuts();
    }
    protected getKeyboardShortcuts() {
        return this.action.keyboardShortcuts;
    }
    get enabled() {
        return this.getEnabled();
    }
    protected getEnabled() {
        return this.action.enabled;
    }
    fire() {
        this.action.fire();
    }
}

class ShortcutAction {
    constructor(private readonly group: KeyboardShortcutGroup, public readonly action: KeyboardAction) {}
    get enabled() {
        return this.action.enabled && this.group.enabled;
    }
    fire() {
        this.action.fire();
    }
}

export class KeyboardShortcutsManagerImpl implements KeyboardShortcutsManager {
    private readonly _shortcuts: KeyboardShortcutGroup[] = [];
    private readonly keyboardMap = new Map<string, ShortcutAction[]>();
    /**
     *
     * @param binder
     */
    constructor(private readonly binder: ShortcutBinder) {
        makeObservable<KeyboardShortcutsManagerImpl, "_shortcuts">(this, {
            _shortcuts: observable.shallow,
            registerKeyboardShortcuts: mobxAction.bound,
            unregisterKeyboardShortcuts: mobxAction.bound,
            shortcuts: computed,
            actionMd: computed
        });
    }

    registerKeyboardShortcuts(shortcuts: KeyboardShortcutGroup) {
        // re-registering shortcuts should move it to the front
        this.unregisterKeyboardShortcuts(shortcuts);
        this._shortcuts.unshift(shortcuts);
        shortcuts.shortcuts.forEach((action) => {
            action.keyboardShortcuts.forEach((shortcut) => {
                let actions = this.keyboardMap.get(shortcut);
                if (!actions) {
                    actions = [];
                    this.keyboardMap.set(shortcut, actions);
                    this.binder.bind(shortcut, () => {
                        const enabledAction = actions!.find((a) => a.enabled);
                        if (enabledAction) {
                            enabledAction.fire();
                        }
                    });
                }
                actions.unshift(new ShortcutAction(shortcuts, action));
            });
        });
    }

    unregisterKeyboardShortcuts(shortcuts: KeyboardShortcutGroup) {
        const index = this._shortcuts.indexOf(shortcuts);
        if (index >= 0) {
            this._shortcuts.splice(index, 1);
            shortcuts.shortcuts.forEach((action) => {
                action.keyboardShortcuts.forEach((shortcut) => {
                    const actions = this.keyboardMap.get(shortcut);
                    if (actions) {
                        const indexAction = actions.findIndex((a) => a.action === action);
                        if (indexAction >= 0) {
                            actions.splice(indexAction, 1);
                        }
                        if (actions.length === 0) {
                            this.binder.unbind(shortcut);
                            this.keyboardMap.delete(shortcut);
                        }
                    }
                });
            });
        }
    }
    get shortcuts() {
        return this._shortcuts.slice();
    }
    get actionMd() {
        return this.shortcuts
            .slice()
            .sort((a, b) => (a.label || '').localeCompare(b.label || ''))
            .filter((s) => s.enabled && !!s.shortcuts.find((a) => a.enabled))
            .map(
                (group) =>
                    `## ${group.label}\n\n${group.shortcuts
                        .sort((a, b) => (a.label || '').localeCompare(b.label || ''))
                        .map(
                            (action) =>
                                ` - ${action.label}: ${action.keyboardShortcuts.map((sc) => `**${sc}**`).join(', ')}`
                        )
                        .join('\n')}`
            )
            .join('\n\n');
    }
}
