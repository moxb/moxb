/**
 * Checks if an attribute is a real attribute and not a getter.
 * @param obj
 * @param prop
 */
function isRealAttribute(obj: any, prop: string): boolean {
    while (obj) {
        const desc = Object.getOwnPropertyDescriptor(obj, prop);
        if (desc && desc.get) {
            return false;
        }
        // walk up the property tree to find the parent class
        obj = Object.getPrototypeOf(obj);
    }
    return true;
}
/**
 * There are lot of bind packages but I could not find one that takes any self and binds all fucntions...
 * @param self
 * @param {T} obj
 * @returns {T}
 */
export function bindAllTo<T>(self: any, obj: T): T {
    for (const key in obj) {
        // Do not access getters. The problem is that getters may do compilcated stuff and we don't want this
        // for the bind function.
        if (isRealAttribute(obj, key)) {
            const func = obj[key] as any;
            if (typeof func === 'function') {
                obj[key] = func.bind(self);
            }
        }
    }
    return obj;
}
