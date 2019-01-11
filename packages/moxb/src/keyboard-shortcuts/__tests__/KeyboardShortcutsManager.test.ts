import { Action } from '../../action/Action';
import { ActionImpl } from '../../action/ActionImpl';
import { setTFunction, translateDefault, translateKeysDefault } from '../../i18n/i18n';
import { KeyboardShortcutGroup, KeyboardShortcutsManager } from '../KeyboardShortcutsManager';
import {
    KeyboardShortcutGroupImpl,
    KeyboardShortcutsManagerImpl,
    ShortcutBinder,
} from '../KeyboardShortcutsManagerImpl';

describe('KeyboardShortcutGroupImpl', function() {
    it('should have id', function() {
        const g = new KeyboardShortcutGroupImpl({
            id: 'theId',
            shortcuts: [],
        });
        expect(g.id).toBe('theId');
    });
    describe('shortcuts option', function() {
        it('should be empty if no actions provided', function() {
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                shortcuts: [],
            });
            expect(g.shortcuts.length).toBe(0);
        });
        it('should have the actions', function() {
            const action0 = new ActionImpl({
                id: 'action0',
                keyboardShortcuts: 'mod+f',
                label: 'Action 0',
                fire: jest.fn(),
            });
            const action1 = new ActionImpl({
                id: 'action1',
                keyboardShortcuts: 'mod+1',
                label: 'Action 1',
                fire: jest.fn(),
            });
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                shortcuts: [action0, action1],
            });
            expect(g.shortcuts[0]).toBe(action0);
            expect(g.shortcuts[1]).toBe(action1);
            expect(g.shortcuts.length).toBe(2);
        });
    });
    describe('enabled', function() {
        it('should be false when options.enabled false', function() {
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                enabled: () => false,
                shortcuts: [],
            });
            expect(g.enabled).toBe(false);
        });
        it('should be true when options.enabled true', function() {
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                enabled: () => true,
                shortcuts: [],
            });
            expect(g.enabled).toBe(true);
        });
        it('should be true when when options.enabled true', function() {
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                disabled: () => true,
                shortcuts: [],
            });
            expect(g.enabled).toBe(false);
        });
        it('should be false when options.disabled true', function() {
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                disabled: () => true,
                shortcuts: [],
            });
            expect(g.enabled).toBe(false);
        });
        it('should be false when options.disabled true and options.enabled true', function() {
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                disabled: () => true,
                enabled: () => true,
                shortcuts: [],
            });
            expect(g.enabled).toBe(false);
        });
    });
    describe('label', function() {
        beforeEach(function() {
            setTFunction(translateDefault);
        });
        afterEach(function() {
            setTFunction(translateDefault);
        });
        it('should be undefined now label is provided', function() {
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                shortcuts: [],
            });
            expect(g.label).toBe(undefined);
        });
        it('should be string if provided', function() {
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                label: 'the label',
                shortcuts: [],
            });
            expect(g.label).toBe('the label');
        });
        it('should be translate string', function() {
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                label: 'the label',
                shortcuts: [],
            });
            setTFunction(translateKeysDefault);

            expect(g.label).toBe('[theId.label] the label');
        });
        it('should be value returned by function if provided', function() {
            const g = new KeyboardShortcutGroupImpl({
                id: 'theId',
                label: () => 'the label',
                shortcuts: [],
            });
            expect(g.label).toBe('the label');
        });
    });
});
describe('registerKeyboardShortcuts', function() {
    // @ts-ignore
    let manager: KeyboardShortcutsManager;

    beforeEach(function() {
        manager = new KeyboardShortcutsManagerImpl({ bind: jest.fn(), unbind: jest.fn() });
    });
    it('should have empty actionMd if no actions defined', function() {
        manager.registerKeyboardShortcuts(
            new KeyboardShortcutGroupImpl({
                id: '',
                shortcuts: [],
            })
        );
        expect(manager.actionMd).toBe('');
    });
    it('should set shortcuts', function() {
        manager.registerKeyboardShortcuts(
            new KeyboardShortcutGroupImpl({
                id: '',
                shortcuts: [
                    new ActionImpl({
                        id: 'action1',
                        keyboardShortcuts: 'mod+f',
                        label: 'Action 1',
                        fire: jest.fn(),
                    }),
                ],
            })
        );
        expect(manager.shortcuts.length).toBe(1);
        expect(manager.shortcuts[0].shortcuts.length).toBe(1);
        expect(manager.shortcuts[0].shortcuts[0].enabled).toBe(true);
    });
    it('should set the shortcuts in reverse order', function() {
        manager.registerKeyboardShortcuts(
            new KeyboardShortcutGroupImpl({
                id: 'g1',
                shortcuts: [],
            })
        );
        manager.registerKeyboardShortcuts(
            new KeyboardShortcutGroupImpl({
                id: 'g2',
                shortcuts: [],
            })
        );
        expect(manager.shortcuts.length).toBe(2);
        expect(manager.shortcuts.map(s => s.id)).toEqual(['g2', 'g1']);
    });
    it('should have empty actionMd if no actions defined', function() {
        manager.registerKeyboardShortcuts(
            new KeyboardShortcutGroupImpl({
                id: 'group1',
                label: 'File',
                shortcuts: [
                    new ActionImpl({
                        id: 'save',
                        label: 'Save',
                        keyboardShortcuts: 'mod+s',
                        fire: jest.fn(),
                    }),
                ],
            })
        );
        //expect(manager.actionMd).toMatchSnapshot();
    });
});
describe('registerKeyboardShortcuts bind', function() {
    it('should call bind', function() {
        const binder: ShortcutBinder = { bind: jest.fn(), unbind: jest.fn() };
        const manager = new KeyboardShortcutsManagerImpl(binder);
        manager.registerKeyboardShortcuts(
            new KeyboardShortcutGroupImpl({
                id: 'group1',
                label: 'File',
                shortcuts: [
                    new ActionImpl({
                        id: 'save',
                        label: 'Save',
                        keyboardShortcuts: 'mod+s',
                        fire: jest.fn(),
                    }),
                ],
            })
        );
        expect(binder.bind).toBeCalledWith('mod+s', expect.any(Function));
        expect(binder.unbind).not.toBeCalled();
    });
    it('should call bind once', function() {
        const binder: ShortcutBinder = { bind: jest.fn(), unbind: jest.fn() };
        const manager = new KeyboardShortcutsManagerImpl(binder);
        manager.registerKeyboardShortcuts(
            new KeyboardShortcutGroupImpl({
                id: 'group1',
                label: 'File',
                shortcuts: [
                    new ActionImpl({
                        id: 'save',
                        label: 'Save',
                        keyboardShortcuts: 'mod+s',
                        fire: jest.fn(),
                    }),
                ],
            })
        );
        expect(binder.bind).toBeCalledTimes(1);
        expect(binder.bind).toBeCalledWith('mod+s', expect.any(Function));
        expect(binder.unbind).not.toBeCalled();
    });
    it('should call bind for each shortcut', function() {
        const binder: ShortcutBinder = { bind: jest.fn(), unbind: jest.fn() };
        const manager = new KeyboardShortcutsManagerImpl(binder);
        manager.registerKeyboardShortcuts(
            new KeyboardShortcutGroupImpl({
                id: 'group1',
                label: 'File',
                shortcuts: [
                    new ActionImpl({
                        id: 'save',
                        label: 'Save',
                        keyboardShortcuts: ['mod+s', 'mod+shift+s'],
                        fire: jest.fn(),
                    }),
                ],
            })
        );
        expect(binder.bind).toBeCalledTimes(2);
        expect(binder.bind).toBeCalledWith('mod+s', expect.any(Function));
        expect(binder.bind).toBeCalledWith('mod+shift+s', expect.any(Function));
        expect(binder.unbind).not.toBeCalled();
    });
    it('should call bind for each unique key', function() {
        const binder: ShortcutBinder = { bind: jest.fn(), unbind: jest.fn() };
        const manager = new KeyboardShortcutsManagerImpl(binder);
        manager.registerKeyboardShortcuts(
            new KeyboardShortcutGroupImpl({
                id: 'group1',
                label: 'File',
                shortcuts: [
                    new ActionImpl({
                        id: 'save',
                        label: 'Save',
                        keyboardShortcuts: ['mod+s', 'mod+shift+s'],
                        fire: jest.fn(),
                    }),
                ],
            })
        );
        manager.registerKeyboardShortcuts(
            new KeyboardShortcutGroupImpl({
                id: 'group1',
                label: 'File',
                shortcuts: [
                    new ActionImpl({
                        id: 'save',
                        label: 'Do Something',
                        keyboardShortcuts: ['mod+s', 'cmd x'],
                        fire: jest.fn(),
                    }),
                ],
            })
        );
        expect(binder.bind).toBeCalledTimes(3);
        expect(binder.bind).toBeCalledWith('mod+s', expect.any(Function));
        expect(binder.bind).toBeCalledWith('mod+shift+s', expect.any(Function));
        expect(binder.bind).toBeCalledWith('cmd x', expect.any(Function));
        expect(binder.unbind).not.toBeCalled();
    });
});
describe('registerKeyboardShortcuts unbind', function() {
    it('should call bind', function() {
        const binder: ShortcutBinder = { bind: jest.fn(), unbind: jest.fn() };
        const manager = new KeyboardShortcutsManagerImpl(binder);

        const shortcuts = new KeyboardShortcutGroupImpl({
            id: 'group1',
            label: 'File',
            shortcuts: [
                new ActionImpl({
                    id: 'save',
                    label: 'Save',
                    keyboardShortcuts: 'mod+s',
                    fire: jest.fn(),
                }),
            ],
        });
        manager.registerKeyboardShortcuts(shortcuts);
        manager.unregisterKeyboardShortcuts(shortcuts);
        expect(binder.unbind).toBeCalledWith('mod+s');
    });
    it('should call unbind once', function() {
        const binder: ShortcutBinder = { bind: jest.fn(), unbind: jest.fn() };
        const manager = new KeyboardShortcutsManagerImpl(binder);
        const shortcuts = new KeyboardShortcutGroupImpl({
            id: 'group1',
            label: 'File',
            shortcuts: [
                new ActionImpl({
                    id: 'save',
                    label: 'Save',
                    keyboardShortcuts: 'mod+s',
                    fire: jest.fn(),
                }),
            ],
        });
        manager.registerKeyboardShortcuts(shortcuts);
        manager.unregisterKeyboardShortcuts(shortcuts);
        expect(binder.unbind).toBeCalledTimes(1);
        expect(binder.unbind).toBeCalledWith('mod+s');
    });
    it('should call unbind for each shortcut', function() {
        const binder: ShortcutBinder = { bind: jest.fn(), unbind: jest.fn() };
        const manager = new KeyboardShortcutsManagerImpl(binder);
        const shortcuts = new KeyboardShortcutGroupImpl({
            id: 'group1',
            label: 'File',
            shortcuts: [
                new ActionImpl({
                    id: 'save',
                    label: 'Save',
                    keyboardShortcuts: ['mod+s', 'mod+shift+s'],
                    fire: jest.fn(),
                }),
            ],
        });
        manager.registerKeyboardShortcuts(shortcuts);
        manager.unregisterKeyboardShortcuts(shortcuts);
        expect(binder.unbind).toBeCalledTimes(2);
        expect(binder.unbind).toBeCalledWith('mod+s');
        expect(binder.unbind).toBeCalledWith('mod+shift+s');
    });
    it('should call unbind for each shortcut when unregisterKeyboardShortcuts is called multiple times', function() {
        const binder: ShortcutBinder = { bind: jest.fn(), unbind: jest.fn() };
        const manager = new KeyboardShortcutsManagerImpl(binder);
        const shortcuts = new KeyboardShortcutGroupImpl({
            id: 'group1',
            label: 'File',
            shortcuts: [
                new ActionImpl({
                    id: 'save',
                    label: 'Save',
                    keyboardShortcuts: ['mod+s', 'mod+shift+s'],
                    fire: jest.fn(),
                }),
            ],
        });
        manager.registerKeyboardShortcuts(shortcuts);
        manager.unregisterKeyboardShortcuts(shortcuts);
        manager.unregisterKeyboardShortcuts(shortcuts);
        expect(binder.unbind).toBeCalledTimes(2);
        expect(binder.unbind).toBeCalledWith('mod+s');
        expect(binder.unbind).toBeCalledWith('mod+shift+s');
    });
    it('should call unbind for each unique key', function() {
        const binder: ShortcutBinder = { bind: jest.fn(), unbind: jest.fn() };
        const manager = new KeyboardShortcutsManagerImpl(binder);
        const shortcuts0 = new KeyboardShortcutGroupImpl({
            id: 'group1',
            label: 'File',
            shortcuts: [
                new ActionImpl({
                    id: 'save',
                    label: 'Save',
                    keyboardShortcuts: ['mod+s', 'mod+shift+s'],
                    fire: jest.fn(),
                }),
            ],
        });
        const shortcuts1 = new KeyboardShortcutGroupImpl({
            id: 'group1',
            label: 'File',
            shortcuts: [
                new ActionImpl({
                    id: 'save',
                    label: 'Do Something',
                    keyboardShortcuts: ['mod+s', 'cmd x'],
                    fire: jest.fn(),
                }),
            ],
        });
        manager.registerKeyboardShortcuts(shortcuts0);
        manager.registerKeyboardShortcuts(shortcuts1);
        manager.unregisterKeyboardShortcuts(shortcuts0);
        expect(binder.unbind).toBeCalledTimes(1);
        expect(binder.unbind).toBeCalledWith('mod+shift+s');

        manager.unregisterKeyboardShortcuts(shortcuts1);
        expect(binder.unbind).toBeCalledTimes(3);
        expect(binder.unbind).toBeCalledWith('mod+s');

        expect(binder.unbind).toBeCalledWith('cmd x');
    });
});
describe('calling actions', function() {
    // @ts-ignore
    let manager: KeyboardShortcutsManager;
    let boundShortcuts: { [sortcut: string]: Function } = {};
    let binder: ShortcutBinder;
    let shortcutsGroup1: KeyboardShortcutGroup;
    let shortcutsGroup2: KeyboardShortcutGroup;
    let group2Enabled = true;
    let action1: Action;
    let action2: Action;
    let action3: Action;
    let action4: Action;
    let fire1 = jest.fn();
    let fire2 = jest.fn();
    let fire3 = jest.fn();
    let fire4 = jest.fn();
    let action4Enabled = true;
    beforeEach(function() {
        boundShortcuts = {};
        binder = {
            bind: (s, f) => (boundShortcuts[s] = f),
            unbind: s => {
                // @ts-ignore
                boundShortcuts[s] = undefined;
            },
        };
        manager = new KeyboardShortcutsManagerImpl(binder);
        fire1 = jest.fn();
        fire2 = jest.fn();
        fire3 = jest.fn();
        fire4 = jest.fn();
        action1 = new ActionImpl({
            id: 'action1',
            label: 'Action 1',
            keyboardShortcuts: 'mod+1',
            fire: fire1,
        });
        action2 = new ActionImpl({
            id: 'action2',
            label: 'Action 2',
            keyboardShortcuts: ['mod+2', 'mod+x'],
            fire: fire2,
        });
        action3 = new ActionImpl({
            id: 'action3',
            label: 'Action 3',
            keyboardShortcuts: 'mod+3',
            fire: fire3,
        });
        action4Enabled = true;
        action4 = new ActionImpl({
            id: 'action4',
            label: 'Action 4',
            enabled: () => action4Enabled,
            keyboardShortcuts: ['mod+4', 'mod+x'],
            fire: fire4,
        });
        shortcutsGroup1 = new KeyboardShortcutGroupImpl({
            id: 'group1',
            label: 'File',
            shortcuts: [action1, action2],
        });
        group2Enabled = true;
        shortcutsGroup2 = new KeyboardShortcutGroupImpl({
            id: 'group1',
            label: 'File',
            enabled: () => group2Enabled,
            shortcuts: [action3, action4],
        });
    });
    it('should call fire on action', function() {
        manager.registerKeyboardShortcuts(shortcutsGroup1);
        manager.registerKeyboardShortcuts(shortcutsGroup2);
        expect(fire1).toBeCalledTimes(0);
        boundShortcuts['mod+1']!();
        expect(fire1).toBeCalledTimes(1);
    });
    it('should call fire the last registered action', function() {
        manager.registerKeyboardShortcuts(shortcutsGroup1);
        manager.registerKeyboardShortcuts(shortcutsGroup2);
        boundShortcuts['mod+x']!();
        expect(fire1).not.toBeCalled();
        expect(fire2).not.toBeCalled();
        expect(fire3).not.toBeCalled();
        expect(fire4).toBeCalledTimes(1);
    });
    it('should not fire disabled actions', function() {
        manager.registerKeyboardShortcuts(shortcutsGroup1);
        manager.registerKeyboardShortcuts(shortcutsGroup2);
        action4Enabled = false;
        boundShortcuts['mod+x']!();

        expect(fire1).not.toBeCalled();
        expect(fire2).toBeCalledTimes(1);
        expect(fire3).not.toBeCalled();
        expect(fire4).not.toBeCalled();
    });
    it('should call fire actions on disabled groups', function() {
        manager.registerKeyboardShortcuts(shortcutsGroup1);
        manager.registerKeyboardShortcuts(shortcutsGroup2);
        group2Enabled = false;
        boundShortcuts['mod+3']!();
        boundShortcuts['mod+4']!();

        expect(fire1).not.toBeCalled();
        expect(fire2).not.toBeCalled();
        expect(fire3).not.toBeCalled();
        expect(fire4).not.toBeCalled();
    });
    it('should remove shortcut when unregistering', function() {
        manager.registerKeyboardShortcuts(shortcutsGroup1);
        manager.registerKeyboardShortcuts(shortcutsGroup2);
        manager.unregisterKeyboardShortcuts(shortcutsGroup2);

        boundShortcuts['mod+x']!();
        // now the newly registered version is taken
        expect(fire1).not.toBeCalled();
        expect(fire2).toBeCalledTimes(1);
        expect(fire3).not.toBeCalled();
        expect(fire4).not.toBeCalled();
    });
    it('should put group first when re-registering', function() {
        manager.registerKeyboardShortcuts(shortcutsGroup1);
        manager.registerKeyboardShortcuts(shortcutsGroup2);
        manager.registerKeyboardShortcuts(shortcutsGroup1);

        boundShortcuts['mod+x']!();
        // now the newly registered version is taken
        expect(fire1).not.toBeCalled();
        expect(fire2).toBeCalledTimes(1);
        expect(fire3).not.toBeCalled();
        expect(fire4).not.toBeCalled();
    });
});

describe('actionMd', function() {
    let manager: KeyboardShortcutsManager;
    let shortcutsGroup1: KeyboardShortcutGroup;
    let shortcutsGroup2: KeyboardShortcutGroup;
    beforeEach(function() {
        manager = new KeyboardShortcutsManagerImpl({ bind: jest.fn(), unbind: jest.fn() });
        shortcutsGroup1 = new KeyboardShortcutGroupImpl({
            id: 'groupFile',
            label: 'File',
            shortcuts: [
                new ActionImpl({
                    id: 'save',
                    label: 'Save',
                    keyboardShortcuts: 'mod+s',
                    fire: jest.fn(),
                }),
                new ActionImpl({
                    id: 'new',
                    label: 'New',
                    keyboardShortcuts: 'mod+n',
                    fire: jest.fn(),
                }),
            ],
        });
        shortcutsGroup2 = new KeyboardShortcutGroupImpl({
            id: 'groupEdit',
            label: 'Edit',
            shortcuts: [
                new ActionImpl({
                    id: 'undo',
                    label: 'Undo',
                    keyboardShortcuts: ['mod+u', 'u'],
                    fire: jest.fn(),
                }),
                new ActionImpl({
                    id: 'redo',
                    label: 'Redo',
                    keyboardShortcuts: ['shift+mod+z', 'mod+y', 'z'],
                    fire: jest.fn(),
                }),
            ],
        });
    });
    it('should write out all actions as markdown of one group', function() {
        manager.registerKeyboardShortcuts(shortcutsGroup1);
        expect(manager.actionMd).toMatchSnapshot();
    });
    it('should write out all actions as markdown of tow groups', function() {
        manager.registerKeyboardShortcuts(shortcutsGroup1);
        manager.registerKeyboardShortcuts(shortcutsGroup2);
        expect(manager.actionMd).toMatchSnapshot();
    });
    it('should create the same result after registering and unregistering a group', function() {
        manager.registerKeyboardShortcuts(shortcutsGroup1);
        const actionMd = manager.actionMd;
        manager.registerKeyboardShortcuts(shortcutsGroup2);
        manager.unregisterKeyboardShortcuts(shortcutsGroup2);
        expect(manager.actionMd).toBe(actionMd);
    });
});
