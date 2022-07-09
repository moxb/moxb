import type {IncomingMessage} from 'http';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {SimpleRest} from 'meteor/simple:rest';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {JsonRoutes, RestMiddleware} from 'meteor/simple:json-routes';
import {getParamsFromRequest, ParametrizationStrategy} from './parametrization';
import {getMethodNameFromUrl, setMethodPreparation} from './index';

export * from './index';

JsonRoutes.Middleware.use('/api', JsonRoutes.Middleware.parseBearerToken);
JsonRoutes.Middleware.use('/api', JsonRoutes.Middleware.authenticateMeteorUserByToken);

JsonRoutes.ErrorMiddleware.use(RestMiddleware.handleErrorAsJson);
SimpleRest.configure({
    collections: []
});

function getEndpointUrl(strategy: ParametrizationStrategy, url: string): string {
    switch (strategy) {
        case 'path':
        case 'pathAndRequestBody':
            return `${url}${url.endsWith('/') ? '' : '/'}:whatever`;
        default:
            return url;
    }
}

/**
 * Register our hook function to always expose new meteor APIs via HTTP REST, too
 */
setMethodPreparation((definition) => {
    const {url, httpMethod = 'get', parameterStrategy} = definition;
    const name = getMethodNameFromUrl(httpMethod, url);
    const settings = {
        url: getEndpointUrl(parameterStrategy, url),
        httpMethod,
        getArgsFromRequest: (parameterStrategy === 'requestBody')
            ? undefined
            : (req: IncomingMessage) => getParamsFromRequest(req, parameterStrategy, url),
    };
    // console.log('Going to use API endpoint settings for method', name, ':', settings);
    SimpleRest.setMethodOptions(name, settings);
});
