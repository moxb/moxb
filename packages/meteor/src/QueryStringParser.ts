import { toDateOrNull } from './ToDate';

function substituteQuotedCharacters(inner: string) {
    return inner.replace(/\\./g, function (s) {
        switch (s[1]) {
            case 'n':
                return '\n';
            case 't':
                return '\t';
            case 'r':
                return '\r';
        }
        return s[1];
    });
}

function quoteStringIfNeeded(string: string) {
    if (string.match(/[\s\"\\]/)) {
        return '"' + string.replace(/(\n\t\r\\"\\)/g, '\\$1') + '"';
    }
    return string;
}

function unquoteSting(str: string): string {
    // if the string is not quoted, we return the original
    const match = str.match(/^"(.*)"$/);
    if (!match) {
        return str;
    }
    return substituteQuotedCharacters(match[1]);
}

function unquoteRegex(regex: string): string {
    const match = regex.match(/^\/(.*)\/$/);
    if (!match) {
        return regex;
    }
    return substituteQuotedCharacters(match[1]);
}

function toValue(q: string) {
    if (q.match(/^".*"$/)) {
        return unquoteSting(q);
    } else if (q.match(/^\/.*\/$/)) {
        const regexString = unquoteRegex(q);
        return new RegExp(regexString, 'i');
    } else {
        return toObject(q);
    }
}

function toObject(value: string) {
    try {
        return JSON.parse(value);
    } catch (e) {
        // ignore it's not a json object
    }
    if (value.match(/^@\d+/)) {
        try {
            const date = toDateOrNull(value.replace(/^@/, ''));
            if (date) {
                return date;
            }
        } catch (e) {}
    } // const date = new Date(value);
    return value;
}

const op: { [op: string]: string } = {
    '<': '$lt',
    '<=': '$lte',
    '=': '$eq',
    '==': '$eq',
    '!=': '$ne',
    '>=': '$gte',
    '>': '$gt',
};

/**
 * maps comparision operations
 * @param q
 * @returns {any}
 */
function mapOperations(q: string): any {
    if (q.match(/^".*"$/)) {
        q = unquoteSting(q);
    } else if (q.match(/^\/.*\/$/)) {
        const regexString = unquoteRegex(q);
        return new RegExp(regexString, 'i');
    }
    const match = q.match(/^(<=?|==?|!=|>=?)(.+)/);
    if (!match) {
        return toObject(q);
    } else {
        return {
            [op[match[1]]]: toObject(match[2]),
        };
    }
}
// Match key value pair
const fieldRegExp = /^(-?[\w\d_.]+):(.*)/;
const sortRegExp = /^sort:([\w\d_.]+)-(asc|desc)/;
// this regex is a bit complicated
// - the field
// - the second part is either a quoted string, a quoted regex or anything not whitespace
const termSplitRegex = /(-?[\w\d_.]+:(?:\/(?:[^\/\\]+|\\.)*\/|"(?:[^"\\]+|\\.)*"|[^\s]+))|\s+/;

function extractFilters(terms: string[]) {
    // the filter part are all fields that contain a ':'
    const filters = terms.filter((s) => s.match(fieldRegExp));

    const andTerms = filters.map((s) => {
        const match = s.match(fieldRegExp)!;

        let field = match[1];
        const value = mapOperations(match[2]);
        // is negation of the terrm
        if (field[0] === '-') {
            field = field.substr(1);
            let negate = '$not';
            if (value === null) {
                negate = '$ne';
            } else if (typeof value !== 'object') {
                negate = '$ne';
            }
            return { [field]: { [negate]: value } };
        } else {
            return { [field]: value };
        }
    });

    // if there is only one search term, we use it as filter
    let filter: any;
    if (andTerms.length === 1) {
        filter = andTerms[0];
    } else if (andTerms.length > 1) {
        filter = { $and: andTerms };
    }
    return filter;
}

function extractSort(sortTerms: string[]): SortTerm | undefined {
    if (sortTerms.length === 0) {
        return undefined;
    }
    const sort: SortTerm = {};

    sortTerms.forEach((term) => {
        const match = term.match(sortRegExp);
        if (match) {
            let dir = 1;
            if (match[2] === 'desc') {
                dir = -1;
            }
            sort[match[1]] = dir;
        }
    });
    return sort;
}

type SortTerm = { [field: string]: number };
interface ParsedQuery {
    // text search string to be used on some text fields
    search?: string;
    // a mongo query
    filter?: object;
    sort?: SortTerm;
}

function getTerms(query: string): string[] {
    const splitTerms = query.split(termSplitRegex);
    // we now remove any empty string, null or undefined
    return splitTerms.filter((s) => s);
}

/**
 * This has been inspired by github query syntax https://help.github.com/articles/search-syntax/
 *
 * - strings are concatenated to one search string.
 * - all search field are combined with AND
 * - the field name is before the `:`
 * - fields of the form `field.subfield:value
 *
 * @param query
 * @returns {any}
 */
function parseQueryString(query: string): ParsedQuery {
    const terms = getTerms(query);
    // all non fields (which does not contain a :) is joined to the search part of the query
    const search = terms.filter((s) => !s.match(fieldRegExp)).join(' ');

    const filter = extractFilters(terms.filter((s) => !s.match(sortRegExp)));
    const sort = extractSort(terms.filter((s) => s.match(sortRegExp)));

    // construct the result
    const result: any = {};
    // only the non empty fields
    if (search) {
        result.search = search;
    }
    if (filter) {
        result.filter = filter;
    }
    if (sort) {
        result.sort = sort;
    }
    return result;
}

/**
 *
 * @param {string} queryString a string line `foo -bar x:/ccc/`
 * @param additionalFilter additional mongo queries or undefined
 * @param {string[]} fields that should be searched
 * @returns {{$and:any[]} | {}}
 */
function parseQueryBasic<T>(
    queryString: string,
    additionalFilter: object | undefined | null,
    fields: string[]
): Mongo.Selector<T> {
    try {
        const { filter, search } = parseQueryString(queryString);
        const searchFilters = {
            $and: (search || '')
                .split(/\s+/)
                .filter((s) => !!s)
                .map((regex) => getSearchStringFilter(regex, fields)),
        };
        return replaceRegexObject(combineWithAnd(searchFilters, filter, additionalFilter));
    } catch (e) {
        // we turn the error into a meteor error. This may happen if there is a syntax error in the regex
        throw new Meteor.Error((e as any).message);
    }
}

/**
 * Takes a list of fields and combines the fields correctly
 * @param {string | undefined} regexString
 * @param {string[]} fields
 * @returns {any}
 */
function getSearchStringFilter(regexString: string | undefined, fields: string[]) {
    if (!regexString) {
        return undefined;
    }
    const { expr, andOr } = extractExpr(regexString);
    return {
        // uses the regex and combines the
        [andOr]: fields.map((f) => ({ [f]: expr })),
        // [andOr]: [
        //     { title: expr },
        //     { userName: expr },
        //     { 'details.description': expr },
        //     { 'details.speaker': expr },
        //     { 'annotations.text': expr },
        // ],
    };
}

/**
 *
 * @param filters combines a list of filters with and
 * @returns {any}
 */
function combineWithAnd(...filters: any[]) {
    const andFilters: any[] = [];
    for (const filter of filters) {
        // only non empty filters
        if (filter) {
            // if already and filter, add all elements
            if (filter.$and) {
                andFilters.push(...filter.$and);
            } else {
                andFilters.push(filter);
            }
        }
    }
    if (andFilters.length === 1) {
        // only one filter in and, we return it without enclosing and
        return andFilters[0];
    } else if (andFilters.length > 1) {
        return {
            $and: andFilters,
        };
    } else {
        return {};
    }
}

function extractExpr(regexString: string) {
    let expr: any;
    let andOr: string;
    // negate by '-' before the regex
    if (regexString[0] === '-') {
        const regex = regexString.slice(1);
        expr = new RegExp(`^((?!${regex}).)*$`, 'i');
        andOr = '$and';
    } else {
        expr = new RegExp(regexString, 'i');
        andOr = '$or';
    }
    return { expr, andOr };
}

function setSearchField(query: string, field: string, value?: string): string {
    const terms = getTerms(query);
    const regExp = getFieldRegex(field);

    const index = terms.findIndex((term) => !!term.match(regExp));
    if (!value) {
        if (index > -1) {
            terms.splice(index, 1);
        }
    } else {
        const newTerm = `${field}:${quoteStringIfNeeded(value)}`;
        if (index < 0) {
            terms.push(newTerm);
        } else {
            terms[index] = newTerm;
        }
    }
    return terms.join(' ');
}

function quoteRegex(field: string) {
    return field.replace(/\./, '\\.');
}

function getFieldRegex(field: string, excludeNegations = false) {
    if (excludeNegations) {
        return new RegExp(`^${quoteRegex(field)}:`);
    } else {
        return new RegExp(`^-?${quoteRegex(field)}:`);
    }
}

function getFieldValueRaw(query: string, field: string, excludeNegations = false): string | undefined {
    const terms = getTerms(query);
    const regExp = getFieldRegex(field, excludeNegations);

    const term = terms.find((t) => !!t.match(regExp));
    if (term != null) {
        const match = term.match(fieldRegExp)!;
        return match[2];
    }
    return undefined;
}

function getFieldValueString(query: string, field: string): string | undefined {
    const value = getFieldValueRaw(query, field, true);
    if (value == null) {
        return undefined;
    }
    return unquoteSting(value);
}

function getFieldValue(query: string, field: string, excludeNegations = false): string | undefined {
    const value = getFieldValueRaw(query, field, excludeNegations);
    if (value === undefined) {
        return undefined;
    }
    return toValue(value);
}

function containsFieldValue(query: string, field: string, excludeNegations = false): boolean {
    const terms = getTerms(query);
    const regExp = getFieldRegex(field, excludeNegations);
    return terms.findIndex((term) => !!term.match(regExp)) > -1;
}

function replaceRegexObject(obj: any) {
    const toReturn = obj;
    for (const key in obj) {
        const v = obj[key];
        if (isObject(v)) {
            replaceRegexObject(v);
        } else if (Array.isArray(v)) {
            replaceRegexArray(v);
        }
        if (v instanceof RegExp) {
            toReturn[key] = {
                $regex: v.source,
                $options: v.flags,
            };
        }
    }

    return toReturn;
}

function replaceRegexArray(array: Array<any>) {
    const toReturn = array;
    array.forEach((v) => {
        if (isObject(v)) {
            replaceRegexObject(v);
        } else if (Array.isArray(v)) {
            replaceRegexArray(v);
        } else if (v instanceof RegExp) {
            v = {
                $regex: v.source,
                $options: v.flags,
            };
        }
    });

    return toReturn;
}

function isObject(value: any) {
    return value && typeof value === 'object' && value.constructor === Object;
}

function getTopLevelFields(fields: any) {
    const obj: any = {};

    for (const key in fields) {
        obj[key.split('.')[0]] = 1;
    }

    return obj;
}

function flattenKeepSpecial(obj: any) {
    const toReturn: any = flattenKeepKeys(obj);
    for (const key in toReturn) {
        const newKey = key
            .split('.')
            .filter((v) => !v.startsWith('$'))
            .join('.');
        if (key !== newKey) {
            // @ts-ignore
            Object.defineProperty(toReturn, newKey, Object.getOwnPropertyDescriptor(toReturn, key));
            // tslint:disable
            delete toReturn[key];
            // tslint:enable
        }
    }

    return toReturn;
}

function flattenKeepKeys(obj: any) {
    const toReturn: any = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
            const flatObject = flattenKeepKeys(obj[key]);
            for (const key2 in flatObject) {
                if (flatObject.hasOwnProperty(key2)) {
                    if (!Array.isArray(obj)) {
                        toReturn[key + '.' + key2] = flatObject[key2];
                    } else {
                        toReturn[key2] = flatObject[key2];
                    }
                }
            }
        } else {
            if (!Array.isArray(obj)) {
                toReturn[key] = 1;
            }
        }
    }

    return toReturn;
}

/**
 * Top level files that have to be included in he object for meteor mongo
 * to properly make subscription on the query work.
 * @param query
 */
export function getFieldFilter(query: Mongo.Selector<any>) {
    const newObj = flattenKeepSpecial(query);
    return getTopLevelFields(newObj);
}
//----------------------------------------------------------

/**
 *
 * @param {string} queryString a string line `foo -bar x:/ccc/`
 * @param additionalFilter additional mongo queries or undefined
 * @param {string[]} fields that should be searched
 * @returns {{$and:any[]} | {}}
 */
export function parseQuery(queryString: string, additionalFilter: object | undefined | null, fields: string[]) {
    function negateRegex(obj: any) {
        if (isObject(obj)) {
            return negateRegexObject(obj);
        } else if (Array.isArray(obj)) {
            return negateRegexArray(obj);
        } else {
            return obj;
        }
    }

    function negateRegexObject(obj: any) {
        let toReturn: any = {};
        for (const key in obj) {
            const value = obj[key];
            if (key === '$not' && value.$regex != null) {
                toReturn = { ...toReturn, ...value, $regex: '^(?!.*' + value.$regex + ')' };
            } else {
                toReturn[key] = negateRegex(value);
            }
        }
        return toReturn;
    }

    function negateRegexArray(array: any[]): any[] {
        return array.map(negateRegex);
    }

    //----------------------------------------------------------

    function simplifyAndOr(obj: any): any {
        if (isObject(obj)) {
            return simplifyAndOrObject(obj);
        } else if (Array.isArray(obj)) {
            return simplifyAndOrArray(obj);
        } else {
            return obj;
        }
    }

    function simplifyAndOrObject(obj: any) {
        if (Object.keys(obj).length === 1) {
            const query = obj.$or || obj.$and;
            if (query && Array.isArray(query) && query.length === 1) {
                return simplifyAndOr(query[0]);
            }
        }
        const toReturn: any = {};
        for (const key in obj) {
            toReturn[key] = simplifyAndOr(obj[key]);
        }
        return toReturn;
    }

    function simplifyAndOrArray(array: any[]): any[] {
        return array.map(simplifyAndOr);
    }
    // return parseQueryBasic(queryString, additionalFilter, fields);
    return simplifyAndOr(
        //
        negateRegexObject(
            //
            replaceRegexObject(
                //
                parseQueryBasic(queryString, additionalFilter, fields)
            )
        )
    );
}

export const _forTest = {
    containsFieldValue,
    getFieldValue,
    getFieldValueString,
    getTopLevelFields,
    parseQueryString,
    replaceRegexObject,
    setSearchField,
};
