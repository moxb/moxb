import { LocationManager, TokenManager, TokenManagerImpl, LinkGenerator, LinkGeneratorImpl } from '@moxb/moxb';
import { Application } from '../app/Application';
import { ApplicationImpl } from '../app/ApplicationImpl';
import { MemTable } from '../memtable/MemTable';
import { MemTableImpl } from '../memtable/MemTableImpl';
import { LocationStoreImpl } from './LocationStoreImpl';
import { UrlStore } from './UrlStore';
import { UrlStoreImpl } from './UrlStoreImpl';
import { ViewStore } from './ViewStore';
import { ViewStoreImpl } from './ViewStoreImpl';
import { mainMenu } from '../MenuStructure';
import { createContext, useContext } from 'react';

export interface Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    readonly locationManager: LocationManager;
    readonly tokenManager: TokenManager;
    readonly url: UrlStore;
    readonly linkGenerator: LinkGenerator;
}

class StoreImpl implements Store {
    readonly app: Application;
    readonly memTable: MemTable;
    readonly view: ViewStore;
    readonly locationManager: LocationManager;
    readonly tokenManager: TokenManager;
    readonly url: UrlStore;
    readonly linkGenerator: LinkGenerator;

    constructor() {
        this.locationManager = new LocationStoreImpl();
        this.tokenManager = new TokenManagerImpl(this.locationManager);
        this.tokenManager.addPermanentMappings(['first', 'second']);
        this.url = new UrlStoreImpl(this.locationManager, this.tokenManager);
        this.app = new ApplicationImpl();
        this.memTable = new MemTableImpl(this.url, this.tokenManager);
        this.view = new ViewStoreImpl();
        this.linkGenerator = new LinkGeneratorImpl({
            locationManager: this.locationManager,
            stateSpace: mainMenu,
            rootUrl: 'https://localhost:3100',
        });
    }
}

export const createStore = (): Store => new StoreImpl();

const StoreContext = createContext<Store | undefined>(undefined);

export const useStore = (): Store => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('Store context not found! Have you wrapped your app with <StoreProvider>?');
    }
    return store;
};

export const StoreProvider = StoreContext.Provider;
