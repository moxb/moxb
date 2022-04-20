import * as React from 'react';
import { LocationManager, LocationManagerProvider } from './location-manager';
import { TokenManager, TokenManagerProvider } from './TokenManager';
import { LinkGenerator, LinkGeneratorProvider } from './navigation-references';

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
