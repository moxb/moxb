import * as React from 'react';
import { useContext } from 'react';
import { LocationManager, TokenManager, LinkGenerator } from '@moxb/moxb';
import { createGlobalContext } from './globalContext';

const LocationManagerContext = createGlobalContext<LocationManager | undefined>('location manager', undefined);

export const LocationManagerProvider = LocationManagerContext.Provider;

export const useLocationManager = (reason: string): LocationManager => {
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

const TokenManagerContext = createGlobalContext<TokenManager | undefined>('token manager', undefined);

export const TokenManagerProvider = TokenManagerContext.Provider;

export const useTokenManager = (): TokenManager => {
    const manager = useContext(TokenManagerContext);
    if (!manager) {
        throw new Error(
            "Can't find React context for TokenManager! Don't forget to wrap your app in a <TokenManagerProvider> tag!"
        );
    }
    return manager;
};

const LinkGeneratorContext = createGlobalContext<LinkGenerator | undefined>('link generator', undefined);

export const LinkGeneratorProvider = LinkGeneratorContext.Provider;

export const useLinkGenerator = (): LinkGenerator => {
    const generator = useContext(LinkGeneratorContext);
    if (!generator) {
        throw new Error(
            "Can't find React context for LinkGenerator Don't forget to wrap your app in a <LinkGeneratorProvider> tag!"
        );
    }
    return generator;
};

interface RoutingStore {
    readonly locationManager: LocationManager;
    readonly tokenManager: TokenManager;
    readonly linkGenerator: LinkGenerator;
}

interface RoutingProviderProps {
    store: RoutingStore;
    children: React.ReactNode;
}

export const RoutingProvider = (props: RoutingProviderProps) => {
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
