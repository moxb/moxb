import { toJS } from 'mobx';
import { decycle } from '@moxb/util';
//
// // helper function to print recursive mobx trees
// (window as any).js = function(value: any, ignore = /\b(store|storage)\b/) {
//     return toJSON(value, ignore);
// };

/**
 * Helper function to print recursive mobx trees
 * @param value
 * @param ignore use for example `/\b(store|storage)\b/` to print an object in the store without getting the
 *        entire store
 */
export function toJSON(value: any, ignore?: RegExp) {
    return JSON.stringify(
        decycle(toJS(value), (v, p) => (ignore && ignore.test(p) ? '**ignored:' + p + '**' : v)),
        (_k, v) => (v instanceof RegExp ? v.toString() : v),
        2
    );
}
