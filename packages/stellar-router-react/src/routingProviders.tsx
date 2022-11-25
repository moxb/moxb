import * as React from 'react';
import { useContext } from 'react';
import { createGlobalContext } from '@moxb/react-html';
import {
    LocationManager,
    TokenManager,
    LinkGenerator,
    BasicLocationManagerImpl,
    TokenManagerImpl,
    LinkGeneratorImpl,
    UpdateMethod,
} from '@moxb/stellar-router-core';
import { BasicLocationManagerProps } from '@moxb/stellar-router-core/dist/location-manager/BasicLocationManagerImpl';
import { UIStateSpace } from './LocationDependentArea';

const LocationManagerContext = createGlobalContext<LocationManager | undefined>('location manager', undefined);

export const LocationManagerProvider = LocationManagerContext.Provider;

export const useLocationManager = (reason = 'no reason'): LocationManager => {
    const manager = useContext(LocationManagerContext);
    if (!manager) {
        throw new Error(
            "Can't find React context for LocationManager for " +
                reason +
                "! Don't forget to wrap your app in a <LocationManagerProvider> tag!"
        );
    }
    return manager;
};

export const useNavigate = (reason = 'no reason') => {
    const locationManager = useLocationManager(reason);
    return (pathTokens: string[] | string, method?: UpdateMethod) => {
        const wantedTokens = Array.isArray(pathTokens)
            ? (pathTokens as string[])
            : (pathTokens as string).split('/').filter((e) => !!e);
        locationManager.trySetPathTokens(0, wantedTokens, method);
    };
};

const TokenManagerContext = createGlobalContext<TokenManager | undefined>('token manager', undefined);

export const TokenManagerProvider = TokenManagerContext.Provider;

export const useTokenManager = (): TokenManager | undefined => useContext(TokenManagerContext);

const LinkGeneratorContext = createGlobalContext<LinkGenerator | undefined>('link generator', undefined);

export const LinkGeneratorProvider = LinkGeneratorContext.Provider;

export const useLinkGenerator = (): LinkGenerator | undefined => useContext(LinkGeneratorContext);

/**
 * The permanent data structures required for routing.
 *
 * This will be maintained as a global store, i.e. a singleton object, which will be made accessible
 * to everyone using the routing provider.
 */
export interface RoutingStore {
    readonly locationManager: LocationManager;
    readonly tokenManager: TokenManager;
    readonly linkGenerator?: LinkGenerator;
}

/**
 * Parameters for specifying behavior when creating a routing store
 */
export interface CreateRoutingStoreProps extends BasicLocationManagerProps {
    /**
     * Should we "wake up" the location manager?
     *
     * Normally the LocationManager will start to watch the history right away.
     * In some special cases this is not desired, and so we want to "let it sleep".
     * If so, set this optional flag to false.
     * (The default is true.)
     */
    activate?: boolean;

    /**
     * Optional description of the state space.
     * (This is only required if we want to be able to generate links based on NavRefs.)
     */
    stateSpace?: UIStateSpace<any>;

    /**
     *  Should we run the token manager in debug mode?
     */
    tokenDebug?: boolean;
}

/**
 * Create a store that will be used for routing.
 */
export function createRoutingStore(props: CreateRoutingStoreProps = {}): RoutingStore {
    const { urlSchema, history, communicator, activate = true, stateSpace, tokenDebug } = props;

    // Create the location manager
    const locationManager = new BasicLocationManagerImpl({ urlSchema, history, communicator });
    if (activate) {
        locationManager.watchHistory();
    }

    // Create the token manager
    const tokenManager = new TokenManagerImpl(locationManager, { debug: tokenDebug });

    // Create the link generator
    const linkGenerator = !stateSpace
        ? undefined
        : new LinkGeneratorImpl({
              locationManager,
              stateSpace,
          });

    return {
        locationManager,
        tokenManager,
        linkGenerator,
    };
}

interface RoutingProviderProps {
    store: RoutingStore;
    children: React.ReactNode;
}

export const StellarRouterProvider = (props: RoutingProviderProps) => {
    const { store, children } = props;
    const { locationManager, tokenManager, linkGenerator } = store;
    return (
        <LocationManagerProvider value={locationManager}>
            <TokenManagerProvider value={tokenManager}>
                <LinkGeneratorProvider value={linkGenerator}>{children}</LinkGeneratorProvider>
            </TokenManagerProvider>
        </LocationManagerProvider>
    );
};
