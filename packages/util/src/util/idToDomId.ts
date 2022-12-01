/**
 * Converts a string to a css id. Note that ids and classes in css are case insensitive, and therefore we convert
 * camel case into lower cases.
 * @param {string | null | undefined} id
 * @returns {string}
 */
export function idToDomId(id: string | null | undefined) {
    return (id || '')
        .replace(/[^-\w\d]+/g, '-')
        .replace(/\.?([A-Z]+)/g, (_x, v) => '_' + v.toLowerCase()) // to camel case
        .replace(/^([\d_-]+)/, '') // start with alpha numeric
        .replace(/[-_]{2,}/g, '-') // no double dashes and _-
        .replace(/^[-_]/g, '') // no _ - at the beginning
        .replace(/[-_]$/g, ''); // no _ - at the end
}
