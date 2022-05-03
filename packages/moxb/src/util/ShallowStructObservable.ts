import { action, comparer, observable, makeObservable } from 'mobx';

/**
 * This class provides an observable that tracks attributes at the top level. Similar to the meteor mini mongo:
 * When a new value is assigned, it changes only the attributes that are structurally different from the current
 * value.
 *
 * For example, if your value is
 *    `{ title: 'foo', numbers:[1,2,3]}`
 * and you assign a new value
 *     `{ title: 'bar', numbers:[1,2,3]}`
 * then only `title` will trigger a change.
 *
 * Why is this different from `@observable.shallow`? Observable shallow is used when we assign new values to the
 * top level attributes. But when we assign a new `value` to `@observable.shallow` then all attributes change.
 *
 * This wrapper checks for the structurally (not deep equal) changed attributes ond only modifies them.
 *
 * *Note*: The only supported way to change the object is by assigning new values using the `set` method! If a top level
 * value is assigned then it would also work. But modifying a child object or array has no effect in reactivity.
 *
 * So, the typical use is: when you get a new version of the object from the server, and you want to minimize the
 * reactions to attributes that have really changed.
 *
 * Given the following code where `data` gets new versions from a rest call or form a meteor subscription:
 *
 *      class MyClass {
 *          @observable // or @observable.struct
 *          data: Data;
 *      }
 *
 * When new data arrives you would make a call like `myObject.data = newData`, where `newData` is a full object with
 * all attributes.
 *
 * In this case the code can be replaced with this:
 *
 *      class MyClass {
 *          private _data = createShallowStructObservable<Data>();
 *          get data() {
 *              return this._data;
 *          }
 *          set data(value) {
 *              this._data.set(value)
 *          }
 *      }
 *
 */

interface ShallowStructObservable<T extends Record<string, any>> {
    set(value: T | undefined): void;

    get(): T | undefined;
}

const noData = { no: 'data' };
type NoData = typeof noData;

class ShallowStructObservableImpl<T extends Record<string, any>> implements ShallowStructObservable<T> {
    @observable
    private _hasData = false;

    // we use shallow to trigger updates if an attribute changes
    @observable.shallow
    private _value: T | NoData = noData; // We can't set it to undefined, because then we can't make it observable...

    constructor() {
        makeObservable(this);
    }

    /**
     * Assign a new version of the value.
     *
     * Assign attributes only if the new version is structurally different from the current one.
     *
     * @param value
     */
    @action
    set(value: T | undefined) {
        if (!this._hasData) {
            if (value === undefined) {
                // nothing to do
            } else {
                this._hasData = true;
                this._value = value;
            }
        } else {
            if (value === undefined) {
                this._value = noData;
                this._hasData = false;
            } else {
                // get all properties from orig and new value
                const keys = new Set<string>();
                Object.keys(value).forEach((k) => keys.add(k));
                Object.keys(this._value).forEach((k) => keys.add(k));

                keys.forEach((k) => {
                    if (!comparer.structural((this._value as T)[k], value[k])) {
                        // console.log('ASSET_CHANGED=', k);
                        const v: any = value[k];
                        if (v === undefined) {
                            // delete undefined attributes from our object
                            delete (this._value as T)[k];
                        } else {
                            (this._value as any)[k] = value[k];
                        }
                    }
                });
            }
        }
    }

    get(): T | undefined {
        return this._hasData ? (this._value as T) : undefined;
    }
}

export function createShallowStructObservable<T>(): ShallowStructObservable<T> {
    return new ShallowStructObservableImpl<T>();
}
