/**
 * There are lot of bind packages but I could not find one that takes any self and binds all fucntions...
 * @param self
 * @param {T} obj
 * @returns {T}
 */
export function bindAllTo<T>(self: any, obj: T): T {
    for (const key in obj) {
        const func = obj[key] as any;
        if (typeof func === 'function') {
            obj[key] = func.bind(self);
        }
    }
    return obj;
}
