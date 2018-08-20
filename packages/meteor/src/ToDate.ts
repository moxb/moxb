/**
 * Tries to return a valid date or null. It can parse (valid) date strings as well as numbers.
 * @param date a valid date or null
 */
/**
 * Tries to return a valid date or null. It can parse (valid) date strings as well as numbers.

 * @param val
 * @param defaultValue
 * @returns {any}
 */
export function toDateOrNull(val: any): Date | null {
    return toDate(val, null);
}

function toDate(val: any, defaultValue: any = null) {
    if (val == null) {
        return defaultValue;
    }
    if (typeof val === 'boolean') {
        return defaultValue;
    }
    if (Array.isArray(val)) {
        return defaultValue;
    }
    let date: Date | null = null;
    if (val instanceof Date) {
        date = val;
    } else {
        date = new Date(val);
    }
    // see: https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
    if (isNaN(date.getTime())) {
        return defaultValue;
    }
    return date;
}

export function toDateOrNow(val: any): Date {
    let date = toDate(val, null);
    if (date == null) {
        date = new Date();
    }
    return date;
}
