/**
 * Check whether any of the provided functions return true.
 *
 * All functions will be called; no lazy evaluation here.
 */
export function isAnyOf(...tests: (() => boolean)[]): boolean {
    const values = tests.map((t) => t());
    return values.some((v) => v);
}
