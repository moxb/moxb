import { ShallowStructObservable } from '../ShallowStructObservable';
import { autorun, observable, runInAction, toJS } from 'mobx';

describe('ShallowStructObservable', function () {
    interface Data {
        name: string;
        words?: string[];
        child?: Data;
    }
    it('should be undefined initially', function () {
        const data = new ShallowStructObservable<Data>();
        expect(data.get()).toBeUndefined();
    });
    it('should be the same as the set value', function () {
        const data = new ShallowStructObservable<Data>();
        data.set({ name: 'foo' });
        expect(toJS(data.get())).toEqual({ name: 'foo' });
    });
    it('should update the value', function () {
        const data = new ShallowStructObservable<Data>();
        data.set({ name: 'foo' });
        data.set({ name: 'bar' });
        expect(toJS(data.get())).toEqual({ name: 'bar' });
    });
});
describe('ShallowStructObservable reactiveness', function () {
    interface Data {
        name: string;
        words?: string[];
        child?: Data;
    }
    class Store {
        @observable.shallow
        _data = new ShallowStructObservable<Data>();
        get data() {
            return this._data.get();
        }
        set data(data) {
            this._data.set(data);
        }
    }
    function installReactions(store: Store) {
        const changes = {
            name: 0,
            words: 0,
            child: 0,
        };
        autorun(() => {
            store.data?.name;
            changes.name += 1;
        });
        autorun(() => {
            store.data?.words;
            changes.words += 1;
        });
        autorun(() => {
            store.data?.child;
            changes.child += 1;
        });
        return changes;
    }
    it('should have no reactions initially', function () {
        const store = new Store();
        const changes = installReactions(store);
        expect(changes).toEqual({
            name: 1,
            words: 1,
            child: 1,
        });
    });
    it('should change all values when going form undefined to an object', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'foo' };
        expect(changes).toEqual({
            name: 2,
            words: 2,
            child: 2,
        });
    });
    it('should change only change the `name`', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'foo' };
        store.data = { name: 'bar' };
        expect(changes).toEqual({
            name: 3,
            words: 2,
            child: 2,
        });
    });
    it('should change change words`', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'foo' };
        store.data = { ...store.data, words: ['foo', 'bar'] };
        expect(changes).toEqual({
            name: 2,
            words: 3,
            child: 2,
        });
    });
    it('should change change `child`', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'foo' };
        store.data = { ...store.data, child: { name: 'child' } };
        expect(changes).toEqual({
            name: 2,
            words: 2,
            child: 3,
        });
    });
    it('should update if all are changed', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'foo' };
        store.data = { name: 'updated', words: ['foo', 'bar'], child: { name: 'child' } };
        expect(changes).toEqual({
            name: 3,
            words: 3,
            child: 3,
        });
    });
    it('should not fire when data inside subobjects change (DO NOT DO THIS)', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'updated', words: ['foo', 'bar'], child: { name: 'child' } };
        store.data.words!.push('baz');
        store.data.child!.name = 'updated';
        expect(changes).toEqual({
            name: 2,
            words: 2,
            child: 2,
        });
        expect(store.data).toEqual({ name: 'updated', words: ['foo', 'bar', 'baz'], child: { name: 'updated' } });
    });
    it('should remove values if not set', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'foo', words: ['foo', 'bar'], child: { name: 'child' } };
        store.data = { name: 'foo' };
        expect(changes).toEqual({
            name: 2,
            words: 3,
            child: 3,
        });
        expect(store.data).toEqual({ name: 'foo' });
    });
    it('should set values to undefined', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'updated', words: ['foo', 'bar'], child: { name: 'child' } };
        store.data = undefined;
        expect(changes).toEqual({
            name: 3,
            words: 3,
            child: 3,
        });
        expect(store.data).toBeUndefined();
    });
    it('should update direct values correctly', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'foo', words: ['foo', 'bar'], child: { name: 'child' } };
        store.data.name = 'new name';
        expect(changes).toEqual({
            name: 3,
            words: 2,
            child: 2,
        });
        expect(store.data).toEqual({ name: 'new name', words: ['foo', 'bar'], child: { name: 'child' } });
    });
    it('should update top level changes of nested values', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'foo', words: ['foo', 'bar'], child: { name: 'child' } };
        store.data!.name = 'new name';
        store.data!.words = [];
        store.data!.child = { name: 'child', words: ['a', 'b'] };
        expect(changes).toEqual({
            name: 3,
            words: 3,
            child: 3,
        });
        expect(store.data).toEqual({ name: 'new name', words: [], child: { name: 'child', words: ['a', 'b'] } });
    });
    it('should run actions correctly', function () {
        const store = new Store();
        const changes = installReactions(store);
        store.data = { name: 'foo', words: ['foo', 'bar'], child: { name: 'child' } };
        runInAction(() => {
            store.data!.name = 'oops';
            store.data!.name = 'new name';
            store.data!.words = ['xxx'];
            store.data!.words = [];
            store.data!.child = { ...store.data!.child!, words: [] };
            store.data!.child = { ...store.data!.child!, words: ['a', 'b'] };
        });
        expect(changes).toEqual({
            name: 3,
            words: 3,
            child: 3,
        });
        expect(store.data).toEqual({ name: 'new name', words: [], child: { name: 'child', words: ['a', 'b'] } });
    });
});
