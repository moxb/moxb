export type TranslateFunction = (key: string, translation: string, options?: object) => string;

/**
 * Returns the default translation
 * @param key
 * @param translation
 * @param options
 */
export const translateDefault: TranslateFunction = (_key: string, translation: string, options?: object) =>
    expandT(translation, options);
/**
 * Translates to key in brackets: `[key]`
 * @param key
 */
export const translateKeysOnly: TranslateFunction = (key: string) => '[' + key + ']';
/**
 * Translates using the `[key] defaultTranslation'
 * @param key
 * @param translation
 * @param options
 */
export const translateKeysDefault: TranslateFunction = (key: string, translation: string, options?: object) =>
    '[' + key + '] ' + expandT(translation, options);

let translate: TranslateFunction = translateDefault;

/**
 * We use a wrapped `t` function that is reactive (with mobx)
 * @type {() => any | void}
 */
export function t(key: string, translation: string, options?: object): string {
    try {
        return translate(key, translation, options);
    } catch (e) {
        console.error(e);
        return translateDefault(key, translation, options);
    }
}

/**
 * returns a translation function
 * @param args
 * @returns {() => any | void}
 */
export function tr(key: string, translation: string, options?: object) {
    return () => t.call(null, key, translation, options);
}

export function setTFunction(tFunction: TranslateFunction) {
    translate = tFunction;
}

function resolve(options: any, path: string[], pathIndex = 0): string {
    if (options == null) {
        return '';
    }
    let value = options[path[pathIndex]];
    if (value == null) {
        value = '';
    }
    if (pathIndex === path.length - 1) {
        return value;
    }
    return resolve(value, path, ++pathIndex);
}

export function expandT(template: string, options?: any) {
    return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, name) => resolve(options, name.split('.')));
}
