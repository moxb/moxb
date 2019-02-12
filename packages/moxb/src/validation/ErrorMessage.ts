export interface ErrorMessage {
    readonly fieldName?: string;
    readonly value?: any;
    readonly key: string;
    readonly message: string;
    readonly reason: string;
    readonly code?: number;
}

function extractErrorKey(error: any) {
    let key;
    if (error.name && error.type) {
        key = error.name + '.' + error.type;
    } else if (error.code && error.errno) {
        key = error.code + '.' + error.errno;
    } else if (error.code && error.command) {
        key = error.code + '.' + error.command;
    } else if (typeof error.error === 'string') {
        key = error.error;
    }
    return key;
}

function extractMessage(error: any) {
    let message;
    if (typeof error.error === 'string') {
        message = error.error;
    }
    message = message || error.reason || error.message;
    return message;
}

/**
 * Extracts an error form
 * @param error
 * @returns {ErrorMessage[]}
 * @constructor
 */
export function extractErrorMessages(error: any): ErrorMessage[] {
    if (error.details && error.details.length && error.details instanceof Array) {
        // this is a simple schema error
        return error.details.map((e: any) => ({ key: e.type, fieldName: e.name, message: e.message, value: e.value }));
    } else {
        let message = extractMessage(error);
        let code;
        if (typeof error.error === 'number') {
            code = error.error;
        }
        let key = extractErrorKey(error);
        if (!key) {
            key = message;
        }
        if (!message) {
            message = key;
        }
        const reason = error.reason || message;
        return [{ key, message, reason, code }];
    }
}

/**
 * Creates a (potentially muliline) error message string.
 * @param error
 */
export function extractErrorString(error: any): string {
    if (!error) {
        return '';
    }
    return extractErrorMessages(error)
        .map(e => e.message || e.reason || 'Error')
        .join('\n');
}
