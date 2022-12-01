import { getValueOrFunction } from '@moxb/util';
import { LinkGenerator, LinkGeneratorProps, LinkResult } from './LinkGenerator';
import { NativeUrlSchema, UrlSchema } from '../url-schema';
import { CoreLinkProps } from '../linking/CoreLinkProps';
import { locationToUrl, SuccessCallback, UpdateMethod } from '../location-manager';
import { LocationToUrlProps, noLocation } from '../location-manager/BasicLocationManagerImpl';
import { StateSpaceHandlerImpl } from '../location-state-space/state-space/StateSpaceHandlerImpl';
import { StateSpaceHandler } from '../location-state-space/state-space/StateSpaceHandler';
import { NavRefCall } from './NavRef';
import { expandPathTokenMapping } from '../TokenManagerImpl';

export class LinkGeneratorImpl implements LinkGenerator {
    protected readonly _schema: UrlSchema;
    protected _preparing = false;
    protected _states: StateSpaceHandler<any, any, any> | undefined;

    constructor(private readonly props: LinkGeneratorProps) {
        const { locationManager, urlSchema } = props;
        this._schema = locationManager ? locationManager._urlSchema : urlSchema || new NativeUrlSchema();
    }

    protected _getStates(): StateSpaceHandler<any, any, any> {
        if (!this._states) {
            if (this._preparing) {
                throw new Error('Recursive _getStates()!');
            }
            this._preparing = true;
            this._states = new StateSpaceHandlerImpl({
                id: 'link-generator-space',
                stateSpace: getValueOrFunction(this.props.stateSpace)!,
            });
        }
        return this._states;
    }

    createLink(navRefCall: NavRefCall<any>): LinkResult {
        const { navRef, tokens } = navRefCall;

        // Look up the state this navRef refers to
        const wantedState = this._getStates().findStateForNavRef(navRef);

        const { totalPathTokens, tokenMapping } = wantedState;

        // Take the path tokens leading to here
        const pathTokens = totalPathTokens.slice();

        // See if this state has some token mappings
        if (tokenMapping && tokenMapping.length && tokens) {
            let hasMissing = false;
            // Add all the tokens
            tokenMapping.forEach((def) => {
                const token = expandPathTokenMapping(def);
                const tokenValue = (tokens as any)[token.key];
                if (token.vanishing) {
                    if (tokenValue !== token.defaultValue) {
                        pathTokens.push(tokenValue!);
                    }
                } else {
                    const missing = tokenValue === undefined;
                    hasMissing = hasMissing || missing;
                    if (!hasMissing) {
                        pathTokens.push(tokenValue!);
                    }
                }
            });
        }

        // Compose the various representations of the result
        const linkProps: CoreLinkProps = {
            to: pathTokens,
        };
        const location = this._schema.getLocation(noLocation, pathTokens, {});

        const urlProps: LocationToUrlProps = {
            protocol: 'http',
            hostname: 'example.com',
            port: '1234',
        };

        const pathAndQueries = locationToUrl(location, urlProps).substr(
            urlProps.protocol.length + 3 + urlProps.hostname.length + 1 + urlProps.port.length
        );
        const fullUrl = this.props.rootUrl ? this.props.rootUrl + pathAndQueries : locationToUrl(location);
        return {
            pathTokens,
            coreProps: linkProps,
            location,
            fullUrl,
        };
    }

    tryGoTo(navRefCall: NavRefCall<any>, updateMethod: UpdateMethod, callback?: SuccessCallback) {
        const { locationManager } = this.props;
        if (!locationManager) {
            throw new Error(
                "This LinkGenerator hasn't been passed a LocationManager, so it can only generate links, but can't go to them!"
            );
        }
        const link = this.createLink(navRefCall);
        locationManager._trySetLocation(link.location, updateMethod, callback);
    }

    doGoTo(navRefCall: NavRefCall<any>, updateMethod: UpdateMethod) {
        const { locationManager } = this.props;
        if (!locationManager) {
            throw new Error(
                "This LinkGenerator hasn't been passed a LocationManager, so it can only generate links, but can't go to them!"
            );
        }
        const link = this.createLink(navRefCall);
        locationManager._doSetLocation(link.location, updateMethod);
    }
}
