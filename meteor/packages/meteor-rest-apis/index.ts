import {getDebugLogger, getValueOrFunction, ValueOrFunction} from '@moxb/moxb';
import {MeteorCallback, MeteorMethodControl, MeteorMethodDefinition, registerMeteorMethod} from '@moxb/meteor';
import {
    combineHttpCallOptions,
    HttpCallOptions,
    HttpMethod, joinWithSlash,
    ParametrizationStrategy,
    prepareRequest
} from './parametrization';


/**
 * Definition for an API endpoint
 */
export interface ApiEndpointDefinition<Input, Output> extends Omit<MeteorMethodDefinition<Input, Output>, 'serverOnly' | 'name'> {
    /**
     * What is the root URL where this API should be accessed?
     */
    apiRootUrl: string;

    /**
     * The path this endpoint is accessible at.
     *
     * I.e. /api/v2/documents/
     *
     * The slash at the beginning and the end is optional.
     */
    url: string;

    /**
     * Which HTTP method should we use?
     */
    httpMethod?: HttpMethod;

    /**
     * How should the parameters be passed?
     */
    parameterStrategy: ParametrizationStrategy;

    /**
     * Any extra HTTP options to use when calling this endpoint
     */
    withExtraOptions?: ValueOrFunction<HttpCallOptions>;
}


export interface ApiEndpointHandle<Input, Output> extends Omit<MeteorMethodControl<Input, Output>, 'call' | 'callPromise'> {

    /**
     * Call as a Meteor method, using the callback-style syntax
     *
     * @param data     The data to provide to the method
     * @param callback The callback to call when finished
     */
    callMethodWithCallback(data: Input, callback?: MeteorCallback<Output>): void;

    /**
     * Call as a Meteor method, using Promise-style syntax
     *
     * @param data The data to provide to the method.
     */
    callMethodPromise(data: Input): Promise<Output>;

    /**
     * Call the HTTP API endpoint
     */
    call(input: Input, options?: HttpCallOptions): Promise<Output>;
}

export function getMethodNameFromUrl(method: HttpMethod, url: string) {
    return method + '-' + url;
}

type Preparation = ((definition: ApiEndpointDefinition<any, any>) => void);

let prepareForMethod: Preparation | undefined;

export function setMethodPreparation(preparation: Preparation) {
    prepareForMethod = preparation;
}

class ApiEndpointWrapper<Input, Output> implements ApiEndpointHandle<Input, Output> {

    private readonly _method: MeteorMethodControl<Input, Output>;

    private readonly _endpoint: string;

    constructor(private readonly definition: ApiEndpointDefinition<Input, Output>) {
        const {url, httpMethod = 'get', parameterStrategy, ...methodDefinition} = definition;

        this._endpoint = url.startsWith('/') ? url.substring(1) : url;
        if (prepareForMethod) {
            prepareForMethod({
                ...definition,
                url: this._endpoint,
            });
        }
        const name = getMethodNameFromUrl(httpMethod, this._endpoint);
        this._method = registerMeteorMethod({
            ...methodDefinition,
            name,
            serverOnly: true,
        });
    }

    callMethodWithCallback(data: Input, callback?: MeteorCallback<Output>) {
        this._method.call(data, callback);
    }

    callMethodPromise(data: Input): Promise<Output> {
        return this._method.callPromise(data);
    }

    get name() {
        return this._method.name;
    }

    get pending() {
        return this._method.pending;
    }

    call(input: Input, callOptions: HttpCallOptions = {}): Promise<Output> {
        const {apiRootUrl, parameterStrategy, httpMethod = 'get', withExtraOptions, url} = this.definition;
        return new Promise<Output>((resolve, reject) => {
            if (apiRootUrl === API_UNSUPPORTED) {
                throw new Error('Can\'t call this API because access path was not specified when initiating API.');
            }

            const endpointOptions = getValueOrFunction(withExtraOptions);
            const wantedOptions = combineHttpCallOptions(endpointOptions, callOptions);
            const {debug} = wantedOptions;
            const logger = getDebugLogger('HTTP API caller ' + url, debug);
            const path = joinWithSlash(apiRootUrl, this._endpoint);
            const request = prepareRequest(httpMethod, path, parameterStrategy, input, wantedOptions);
            logger.log('Prepared request', request);
            fetch(request).then((result) => {
                if (result.status === 200) {
                    result.text().then(
                        (text) => {
                            if (!text.length) {
                                // empty response, this could be ok, depending on the circumstances...
                                resolve(null as any);
                            } else {
                                // Let's parse the answer
                                try {
                                    resolve(JSON.parse(text));
                                } catch (jsonError) {
                                    resolve(text as any);
                                    reject('failed to parse JSON data');
                                }
                            }
                        },
                        (error) => {
                            reject('Failed to read text: ' + error); // TODO
                        }
                    );
                } else {
                    logger.log('Status code is not 200, so we have probably failed');
                    result.text().then(
                        (text) => {
                            if (!text.length) {
                                reject('Error ' + result.status);
                            } else {
                                logger.log('Incoming error', text);
                                try {
                                    const returnError = JSON.parse(text);
                                    reject(returnError);
                                } catch (jsonError) {
                                    throw new Error(text);
                                }
                            }
                        },
                        () => reject('Error ' + result.status),
                    );

                }
            }, (error) => {
                logger.log('Failed to execute call', error);
                reject(error);
            });


        });
    }
}

export function registerApiEndpoint<Input, Output>(definition: ApiEndpointDefinition<Input, Output>): ApiEndpointHandle<Input, Output> {
    return new ApiEndpointWrapper(definition);
}

type TokenSource = () => string | undefined;

export const meteorTokenSource: TokenSource = () => (Accounts as any)._storedLoginToken();

export interface ApiOptions {
    /**
     * The root path where this API should be published (within this server)
     */
    rootPath?: string;

    /**
     * The root URL where this API should be accessed.
     *
     * (Only used on the client side.)
     */
    accessPath?: string;

    /**
     * How can we get an access tone, if necessary?
     */
    authTokenSource?: TokenSource;
}

interface EndpointDefinition<Input, Output> extends Omit<ApiEndpointDefinition<Input, Output>, 'apiRootUrl'> {
    useAuth?: boolean;
}


const API_UNSUPPORTED = 'UNSUPPORTED';

/**
 * Base class for defining APIs
 */
export class Api {

    private readonly _accessRootPath: string;

    constructor(private readonly _options: ApiOptions) {
        const {accessPath} = this._options;
        if (accessPath) {
            // Access path explicitly configured
            this._accessRootPath = accessPath;
        } else if (global.window) {
            // No access path given, but there is a window.
            // We are probably in a browser.
            // We will just use the server where we are running from.
            const {protocol, hostname, port} = global.window.location;
            this._accessRootPath = `${protocol}//${hostname}:${port}/`;
        } else {
            // No access path given, and there is no window.
            // There is no way for us to access the API.
            this._accessRootPath = API_UNSUPPORTED;
        }
    }

    /**
     * Define a new endpoint on this API
     */
    protected defineEndpoint<Input, Output>(definition: EndpointDefinition<Input, Output>): ApiEndpointHandle<Input, Output> {
        const {useAuth, ...details} = definition;

        // Calculate the URL by appending the root url with the given one
        const url = joinWithSlash(this._options.rootPath || '/', definition.url);

        // Do we want auth?
        let {execute, withExtraOptions} = definition;
        if (useAuth) {
            // On the client side, make sure that we attach an auth token
            withExtraOptions = () => {
                const defOptions = getValueOrFunction(definition.withExtraOptions);
                const {authTokenSource} = this._options;
                if (!authTokenSource) {
                    throw new Error('You can\'t call an endpoint that uses useAuth if auth token source is not specified!');
                }
                const authToken = authTokenSource();
                if (!authToken) {
                    throw new Error(`The ${url} API endpoint can't be called when not logged in!`);
                }
                const authOptions: HttpCallOptions = {
                    extraHeaders: {
                        Authorization: 'Bearer ' + authToken,
                    }
                };
                return combineHttpCallOptions(defOptions, authOptions);
            };
            // On the server side, make sure to verify user session
            execute = (input, userId, context) => {
                if (!userId) {
                    throw new Meteor.Error('403-not-authenticated', 'You are not authenticated');
                }
                return definition.execute(input, userId, context);
            };
        }
        return registerApiEndpoint({
            ...details,
            apiRootUrl: this._accessRootPath,
            url,
            withExtraOptions,
            execute,
        });
    }
}
