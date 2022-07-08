import type {IncomingMessage} from 'http';

/**
 * Parameterization strategy for an API endpoint
 */
export type ParametrizationStrategy =
    | 'none'          // there are no parameters
    | 'path'          // there is only a single parameter, which is appended to the URL
    | 'queryString'   // parameters go to the url search query string
    | 'header'        // parameters are passed as HTTP headers
    | 'requestBody'   // parameters are passed as a JSON object in the request body
    | 'pathAndRequestBody';  // ID goes to path, the rest is passed as JSON object in the request body. If you use this, the data should always have `id` and `document` fields.

/**
 * HTTP method to use for an API endpoint
 */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

/**
 * Check if a given combination of http method and parametrization strategy is legal
 */
export function isCombinationSupported(httpMethod: HttpMethod, parameterStrategy: ParametrizationStrategy): boolean {
    if ((httpMethod === 'get') && (parameterStrategy === 'requestBody')) {
        return false;
    }
    if ((httpMethod === 'get') && (parameterStrategy === 'pathAndRequestBody')) {
        return false;
    }
    // TODO: add other unsupported combinations
    return true;
}

export interface HttpCallOptions {
    /**
     * Extra headers to attach
     */
    extraHeaders?: HeadersInit;

    /**
     * Run in debug mode?
     */
    debug?: boolean;
}

const combineExtraHeaders = (h1: HeadersInit = {}, h2: HeadersInit = {}): HeadersInit => ({
    ...h1,
    ...h2,
});

export const combineHttpCallOptions = (o1: HttpCallOptions = {}, o2: HttpCallOptions = {}): HttpCallOptions => ({
    extraHeaders: combineExtraHeaders(o1.extraHeaders, o2.extraHeaders),
    debug: o1.debug || o2.debug,
});

export const joinWithSlash = (part1: string, part2: string): string => {
    const slash1 = part1.endsWith('/');
    const slash2 = part2.startsWith('/');
    if (!slash1 && !slash2) {
        // No slashes, so we add one
        return part1 + '/' + part2;
    } else if ((slash1 && !slash2) || (!slash1 && slash2)) {
        // There is exactly one slash, nothing to add
        return part1 + part2;
    } else {
        // there are two slashes, we drop one
        return part1 + part2.substring(1);
    }
};

/**
 * Prepare an HTTP request with the given HTTP method, using the requested parametrization strategy
 */
// eslint-disable-next-line complexity
export function prepareRequest(httpMethod: HttpMethod, path: string, strategy: ParametrizationStrategy, data: any, options: HttpCallOptions = {}): Request {
    const {extraHeaders = {}} = options;
    const pieces: string[] = [];
    if (!isCombinationSupported(httpMethod, strategy)) {
        throw new Error(`You can't use the ${strategy} strategy with a ${httpMethod} request!`);
    }
    switch (strategy) {
        case 'none':
            return new Request(path, {
                method: httpMethod,
                headers: extraHeaders,
            });
        case 'path':
            if (typeof (data) === 'object') {
                throw new Error('Can\'t pass complex parameters using the PATH strategy!');
            }
            return new Request(joinWithSlash(path, encodeURIComponent(data)), {
                method: httpMethod,
                headers: extraHeaders,
            });
        case 'queryString':
            if (data) {
                const queryData = (typeof (data) === 'object') ? data : {data};
                Object.keys(queryData).forEach((key) => {
                    const value = (queryData as any)[key];
                    if (value != null) {
                        pieces.push(key + '=' + encodeURIComponent(value));
                    }
                });
            }
            return new Request(path + (pieces.length ? ('?' + pieces.join('&')) : ''), {
                method: httpMethod,
                headers: extraHeaders,
            });
        case 'header':
            return new Request(path + (pieces.length ? ('?' + pieces.join('&')) : ''), {
                method: httpMethod,
                headers: {
                    ...((typeof (data) === 'object') ? data : {'x-data': data}),
                    ...extraHeaders,
                },
            });
        case 'requestBody':
            return new Request(path, {
                method: httpMethod,
                body: JSON.stringify(((typeof data) === 'object') ? data : [data]) as any,
                headers: {
                    'content-type': 'application/json',
                    ...extraHeaders,
                },
            });
        case 'pathAndRequestBody':
            // eslint-disable-next-line no-case-declarations
            const {id, document} = data;
            if (!id) {
                throw new Error('When using the pathAndRequestBody strategy, the input must have and ID field!');
            }
            if (!document) {
                throw new Error('When using the pathAndRequestBody strategy, the input must have a document field!');
            }
            return new Request(joinWithSlash(path, encodeURIComponent(id)), {
                method: httpMethod,
                body: JSON.stringify(document) as any,
                headers: {
                    'content-type': 'application/json',
                    ...extraHeaders,
                },
            });
        default:
            throw new Error('Requested unknown API parametrization strategy: ' + strategy);
    }
}

/**
 * A simple function to parse an HTML query string to key-value pairs
 */
function parseQuery(query: string) {
    const result: Record<string, any> = {};
    if (!query) {
        return result;
    }
    query.split('&').forEach((q) => {
        const [key, value] = q.split('=');
        result[key] = decodeURIComponent(value);
    });
    return result;
}

/**
 * Get out the API input data from an incoming HTTP request, according to the chosen API parametrization strategy
 */
// eslint-disable-next-line complexity
export function getParamsFromRequest(request: IncomingMessage, strategy: ParametrizationStrategy, endpointPath: string) {
    let params: Record<string, any>;
    switch (strategy) {
        case 'none':
            return [];
        case 'path':
            try {
                const remainder = request.url!.substring(endpointPath.length + 1);
                return remainder.split('/').filter(p => !!p);
            } catch (error) {
                return [];
            }
        case 'requestBody':
            /**
             * I didn't implement this strategy here, because
             * - the library I used this for already came with a solution for this approach
             * - implementing this would rely on some other middleware for reading and parsing
             *   the body stream, and I wanted to keep this library lightweight, without any
             *   unwanted dependencies.
             */
            throw new Error('Not implemented');
        case 'pathAndRequestBody':
            try {
                const remainder = request.url!.substring(endpointPath.length + 1);
                const pieces = remainder.split('/').filter(p => !!p);
                const id = pieces[0];
                const document = (request as any).body;
                return [{id, document}];
            } catch (sError) {
                console.log('Error while analyzing incoming request with the', strategy, 'strategy:', sError);
                return [];
            }

        case 'header':
            if (request.headers['x-data'] !== undefined) {
                return [request.headers['x-data']];
            } else {
                return [request.headers];
            }
        case 'queryString':
            try {
                const queryString = request.url!.substring(endpointPath.length + 2);
                // console.log('Query string', queryString);
                const queries = parseQuery(queryString);
                // console.log('Queries', queries);
                params = ((Object.keys(queries).length === 1) && (!!queries.data) && (typeof (queries.data) !== 'object'))
                    // If we have artificially called the one and only arg "data", remove that wrapping.
                    ? [queries.data]
                    : [queries];
                // console.log('Params', params);
                return params;

            } catch (error) {
                console.log('failed to process query string', request.url, error);
                return [];
            }

        default:
            throw new Error('Requested unknown API parametrization strategy: ' + strategy);
    }
}

export const parseBool = (value: boolean | string): boolean => {
    const typeDef = typeof value;
    switch (typeDef) {
        case 'boolean':
            return value as boolean;
        case 'string':
            return (value as string).toLowerCase() === 'true';
        default:
            throw new Error(`I don\t know how to interpret ${typeDef} ${value} as boolean!`);
    }
};
